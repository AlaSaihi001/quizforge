import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Groq from "groq-sdk"
import { prisma } from "@/lib/prisma"
import { prompts, type GenerationMode } from "@/lib/prompts"

// Initialise le client Groq une seule fois
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {

  // ── 1. VÉRIFIER L'AUTH ────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  // ── 2. RÉCUPÉRER L'UTILISATEUR + CRÉDITS ─────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { credits: true },
  })

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  }

  // ── 3. VÉRIFIER LES CRÉDITS ───────────────────────────────────────────────
  const creditsUsed = user.credits?.used ?? 0
  const creditsTotal = user.credits?.total ?? 10

  if (creditsUsed >= creditsTotal) {
    return NextResponse.json({ error: "NO_CREDITS" }, { status: 402 })
  }

  // ── 4. VALIDER LE BODY ────────────────────────────────────────────────────
  const body = await req.json()
  const { inputText, mode, language } = body as {
    inputText: string
    mode: GenerationMode
    language: string
  }

  if (!inputText || inputText.trim().length < 50) {
    return NextResponse.json({ error: "TEXT_TOO_SHORT" }, { status: 400 })
  }

  if (!["MCQ", "FLASHCARDS", "SUMMARY"].includes(mode)) {
    return NextResponse.json({ error: "INVALID_MODE" }, { status: 400 })
  }

  // ── 5. STREAM GROQ ────────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const prompt = prompts[mode](inputText.trim(), language)

        // Groq streaming — syntaxe identique à OpenAI
        const groqStream = await groq.chat.completions.create({
          // Modèles gratuits disponibles sur Groq :
          // "llama-3.1-8b-instant"     ← rapide, léger
          // "llama-3.3-70b-versatile"  ← meilleure qualité
          // "mixtral-8x7b-32768"       ← bon pour JSON structuré
          model: "llama-3.3-70b-versatile",
          max_tokens: 2500,
          stream: true,
          temperature: 0.3, // bas = plus cohérent pour du JSON
          messages: [
            { role: "system", content: prompt.system },
            { role: "user", content: prompt.user },
          ],
        })

        let fullText = ""

        // Lit chaque chunk du stream
        for await (const chunk of groqStream) {
          const text = chunk.choices[0]?.delta?.content ?? ""

          if (text) {
            fullText += text
            // Envoie le chunk au client en temps réel
            controller.enqueue(new TextEncoder().encode(text))
          }
        }

        // ── 6. SAUVEGARDER EN DB ─────────────────────────────────────────────
        // Transaction : création génération + décrément crédit
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
        console.error("Groq generation error:", error)
        controller.enqueue(
          new TextEncoder().encode(`ERROR:${error.message}`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  })
}