import { prisma } from "@/lib/prisma"

// ─── CREATE SUBSCRIPTION (called from Stripe webhook) ────────────────────────
export async function createSubscription({
  userId,
  stripeCustomerId,
  stripePriceId,
  stripeSubId,
  status,
  currentPeriodEnd,
}: {
  userId: string
  stripeCustomerId: string
  stripePriceId: string
  stripeSubId: string
  status: string
  currentPeriodEnd: Date
}) {
  return prisma.subscription.create({
    data: {
      userId,
      stripeCustomerId,
      stripePriceId,
      stripeSubId,
      status,
      currentPeriodEnd,
    },
  })
}

// ─── GET SUBSCRIPTION BY USER ID ─────────────────────────────────────────────
export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  })
}

// ─── UPDATE SUBSCRIPTION STATUS ──────────────────────────────────────────────
export async function updateSubscriptionStatus(
  stripeSubId: string,
  status: string,
  currentPeriodEnd: Date
) {
  return prisma.subscription.update({
    where: { stripeSubId },
    data: { status, currentPeriodEnd },
  })
}

// ─── DELETE SUBSCRIPTION (on cancellation) ───────────────────────────────────
export async function deleteSubscription(stripeSubId: string) {
  return prisma.subscription.delete({
    where: { stripeSubId },
  })
}

// ─── CHECK IF SUBSCRIPTION IS ACTIVE ─────────────────────────────────────────
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, currentPeriodEnd: true },
  })

  if (!sub) return false
  if (sub.status !== "active") return false
  if (new Date() > sub.currentPeriodEnd) return false

  return true
}