"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// Marque l'onboarding comme complété en DB
export async function completeOnboarding() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) return { error: "UNAUTHORIZED" }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { onboardingCompleted: true },
  })

  return { success: true }
}

// Vérifie si l'user a complété l'onboarding
export async function checkOnboardingStatus(): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) return true // pas connecté → pas d'onboarding

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { onboardingCompleted: true },
  })

  return user?.onboardingCompleted ?? false
}