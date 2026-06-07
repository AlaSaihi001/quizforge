import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Cette route est appelée automatiquement par Vercel Cron chaque nuit
// En local, on peut la tester manuellement avec un GET request

export async function GET(req: NextRequest) {

  // ── SÉCURITÉ ──────────────────────────────────────────────────────────────
  // On vérifie un secret pour que personne d'autre ne puisse déclencher le reset
  // Ce secret doit être dans .env ET dans la config Vercel
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  // En production, on vérifie le secret
  // En développement, on permet l'accès direct pour tester
  if (process.env.NODE_ENV === "production") {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    }
  }

  try {
    const now = new Date()

    // Récupère tous les users FREE
    const freeUsers = await prisma.user.findMany({
      where: { plan: "FREE" },
      select: { id: true, email: true },
    })

    if (freeUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No FREE users to reset",
        resetCount: 0,
      })
    }

    const userIds = freeUsers.map((u) => u.id)

    // Reset tous les crédits des users FREE en une seule requête
    // updateMany = beaucoup plus efficace que boucler sur chaque user
    const result = await prisma.credit.updateMany({
      where: {
        userId: { in: userIds },
        used: { gt: 0 }, // seulement ceux qui ont utilisé des crédits
      },
      data: {
        used: 0,
        resetAt: now,
      },
    })

    console.log(`✅ Credits reset for ${result.count} users at ${now.toISOString()}`)

    return NextResponse.json({
      success: true,
      message: `Credits reset for ${result.count} users`,
      resetCount: result.count,
      timestamp: now.toISOString(),
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Cron reset error:", error)
    return NextResponse.json(
      { error: "RESET_FAILED", message: error.message },
      { status: 500 }
    )
  }
}