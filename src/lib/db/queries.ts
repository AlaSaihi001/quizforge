import { prisma } from "@/lib/prisma"

// ── USER QUERIES ──────────────────────────────────────────────────────────────

// Récupère seulement les champs nécessaires pour le dashboard layout
export async function getUserForLayout(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      onboardingCompleted: true,
      credits: {
        select: {
          used: true,
          total: true,
          resetAt: true,
        },
      },
    },
  })
}

// Récupère les stats pour le dashboard page
export async function getDashboardStats(userId: string) {
  // parallel queries — s'exécutent en même temps, pas l'une après l'autre
  const [totalGenerations, recentGenerations, user] = await Promise.all([

    prisma.generation.count({
      where: { userId },
    }),

    prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        mode: true,
        inputText: true,
        createdAt: true,
        shareToken: true,
      },
    }),

    prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        credits: {
          select: { used: true, total: true },
        },
      },
    }),

  ])

  return { totalGenerations, recentGenerations, user }
}

// Récupère l'historique paginé
export async function getUserGenerations(
  userId: string,
  isPro: boolean,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit
  const take = isPro ? limit : Math.min(limit, 20) // FREE = max 20

  const [generations, total] = await Promise.all([
    prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        mode: true,
        inputText: true,
        createdAt: true,
        shareToken: true,
        language: true,
      },
    }),
    prisma.generation.count({ where: { userId } }),
  ])

  return { generations, total, hasMore: skip + take < total }
}