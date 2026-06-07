import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Groq from "groq-sdk"
import { prisma } from "@/lib/prisma"
import { prompts, type GenerationMode } from "@/lib/prompts"
import { checkRateLimit } from "@/lib/rate-limit"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {

  // ── ÉTAPE 1 : AUTH ───────────────────────────────────────────────────────
  // Vérifie que l'utilisateur est connecté
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  // ── ÉTAPE 2 : RÉCUPÉRER L'UTILISATEUR ────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  })

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  }

  // ── ÉTAPE 3 : RATE LIMITING REDIS ────────────────────────────────────────
  // On vérifie Redis AVANT la DB — Redis est plus rapide
  // Si le user fait trop de requêtes, on bloque ici sans toucher la DB

  const rateLimit = await checkRateLimit(user.id)

  if (!rateLimit.allowed) {
    // Calcule dans combien de secondes le rate limit se reset
    const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000)

    return NextResponse.json(
      {
        error: "RATE_LIMITED",
        message: `Too many requests. Try again in ${retryAfter} seconds.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          // Header standard pour indiquer quand réessayer
          "Retry-After": retryAfter.toString(),
        },
      }
    )
  }

  // ── ÉTAPE 4 : VÉRIFIER LES CRÉDITS DB ────────────────────────────────────
  // Seulement après le rate limit, on vérifie les crédits dans la DB

  const creditsUsed = user.credits?.used ?? 0
  const creditsTotal = user.credits?.total ?? 10

  if (creditsUsed >= creditsTotal) {
    return NextResponse.json(
      {
        error: "NO_CREDITS",
        message: "You've used all your credits for today.",
        creditsUsed,
        creditsTotal,
      },
      { status: 402 }
    )
  }

  // ── ÉTAPE 5 : VALIDER LE BODY ─────────────────────────────────────────────
  let body: { inputText: string; mode: GenerationMode; language: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 })
  }

  const { inputText, mode, language } = body

  if (!inputText || inputText.trim().length < 50) {
    return NextResponse.json({ error: "TEXT_TOO_SHORT" }, { status: 400 })
  }

  if (!["MCQ", "FLASHCARDS", "SUMMARY"].includes(mode)) {
    return NextResponse.json({ error: "INVALID_MODE" }, { status: 400 })
  }

  // ── ÉTAPE 6 : STREAM GROQ ─────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const prompt = prompts[mode](inputText.trim(), language)

        const groqStream = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          max_tokens: 2500,
          stream: true,
          temperature: 0.3,
          messages: [
            { role: "system", content: prompt.system },
            { role: "user", content: prompt.user },
          ],
        })

        let fullText = ""

        for await (const chunk of groqStream) {
          const text = chunk.choices[0]?.delta?.content ?? ""
          if (text) {
            fullText += text
            controller.enqueue(new TextEncoder().encode(text))
          }
        }

        // ── ÉTAPE 7 : SAUVEGARDER + DÉCRÉMENTER ──────────────────────────────
        // Transaction atomique : les deux opérations réussissent ou les deux échouent
        await prisma.$transaction([
          prisma.generation.create({
            data: {
              userId: user.id,
              inputText: inputText.trim(),
              outputText: fullText,
              mode,
              language,
            },
          }),
          prisma.credit.update({
            where: { userId: user.id },
            data: { used: { increment: 1 } },
          }),
        ])

        controller.close()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Generation error:", error)
        controller.enqueue(new TextEncoder().encode(`ERROR:${error.message}`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
      // Envoie les crédits restants dans les headers pour le frontend
      "X-Credits-Remaining": String(creditsTotal - creditsUsed - 1),
      "X-Rate-Limit-Remaining": String(rateLimit.remaining),
    },
  })
}

// ── ROUTE GET — pour récupérer les crédits actuels ────────────────────────────
// Utilisé par la sidebar pour afficher les crédits en temps réel
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  })

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  }

  return NextResponse.json({
    used: user.credits?.used ?? 0,
    total: user.credits?.total ?? 10,
    remaining: (user.credits?.total ?? 10) - (user.credits?.used ?? 0),
    plan: user.plan,
    resetAt: user.credits?.resetAt,
  })
}