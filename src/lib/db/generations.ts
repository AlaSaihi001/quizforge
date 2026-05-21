import { prisma } from "@/lib/prisma"
import { GenerationMode } from "@prisma/client"

// ─── CREATE GENERATION + DECREMENT CREDIT (atomic transaction) ────────────────
export async function createGeneration({
  userId,
  inputText,
  outputText,
  mode,
  language = "en",
}: {
  userId: string
  inputText: string
  outputText: string
  mode: GenerationMode
  language?: string
}) {
  return prisma.$transaction(async (tx) => {
    // 1. Check credits first
    const credit = await tx.credit.findUnique({ where: { userId } })

    if (!credit || credit.used >= credit.total) {
      throw new Error("NO_CREDITS")
    }

    // 2. Create the generation
    const generation = await tx.generation.create({
      data: {
        userId,
        inputText,
        outputText,
        mode,
        language,
      },
    })

    // 3. Decrement credit
    await tx.credit.update({
      where: { userId },
      data: { used: { increment: 1 } },
    })

    return generation
  })
}

// ─── GET ALL GENERATIONS FOR A USER ──────────────────────────────────────────
export async function getUserGenerations(userId: string, limit = 20) {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      mode: true,
      language: true,
      createdAt: true,
      shareToken: true,
      inputText: true,  // we'll truncate on frontend
    },
  })
}

// ─── GET ONE GENERATION BY ID ─────────────────────────────────────────────────
export async function getGenerationById(id: string, userId: string) {
  return prisma.generation.findFirst({
    where: {
      id,
      userId, // security: user can only see their own
    },
  })
}

// ─── GET GENERATION BY SHARE TOKEN (public, no auth) ─────────────────────────
export async function getGenerationByShareToken(shareToken: string) {
  return prisma.generation.findUnique({
    where: { shareToken },
    select: {
      id: true,
      outputText: true,
      mode: true,
      language: true,
      createdAt: true,
      // do NOT return userId or inputText for privacy
    },
  })
}

// ─── DELETE A GENERATION ──────────────────────────────────────────────────────
export async function deleteGeneration(id: string, userId: string) {
  return prisma.generation.deleteMany({
    where: {
      id,
      userId, // security: user can only delete their own
    },
  })
}

// ─── GET TOTAL GENERATION COUNT FOR A USER ───────────────────────────────────
export async function getUserGenerationCount(userId: string): Promise<number> {
  return prisma.generation.count({
    where: { userId },
  })
}