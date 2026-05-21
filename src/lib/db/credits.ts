import { prisma } from "@/lib/prisma"

// ─── GET USER CREDITS ─────────────────────────────────────────────────────────
export async function getUserCredits(userId: string) {
  return prisma.credit.findUnique({
    where: { userId },
  })
}

// ─── CHECK IF USER HAS CREDITS AVAILABLE ─────────────────────────────────────
export async function hasCreditsAvailable(userId: string): Promise<boolean> {
  const credit = await prisma.credit.findUnique({
    where: { userId },
  })

  if (!credit) return false
  return credit.used < credit.total
}

// ─── DECREMENT CREDIT (use inside a transaction with generation create) ───────
export async function decrementCredit(userId: string) {
  return prisma.credit.update({
    where: { userId },
    data: {
      used: { increment: 1 },
    },
  })
}

// ─── RESET CREDITS (called by daily cron job for FREE users) ─────────────────
export async function resetCreditsForFreeUsers() {
  const now = new Date()

  // Find all FREE users
  const freeUsers = await prisma.user.findMany({
    where: { plan: "FREE" },
    select: { id: true },
  })

  const userIds = freeUsers.map((u) => u.id)

  // Reset their credits
  const result = await prisma.credit.updateMany({
    where: {
      userId: { in: userIds },
    },
    data: {
      used: 0,
      resetAt: now,
    },
  })

  return result
}

// ─── SET PRO CREDITS (unlimited) ─────────────────────────────────────────────
export async function setProCredits(userId: string) {
  return prisma.credit.update({
    where: { userId },
    data: {
      total: 99999,
      used: 0,
    },
  })
}

// ─── REVERT TO FREE CREDITS (on subscription cancel) ─────────────────────────
export async function revertToFreeCredits(userId: string) {
  return prisma.credit.update({
    where: { userId },
    data: {
      total: 10,
      used: 0,
    },
  })
}