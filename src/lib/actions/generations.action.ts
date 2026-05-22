"use server"

import { prisma } from "@/lib/prisma"

export async function getRecentGenerations(userId: string) {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      mode: true,
      language: true,
      createdAt: true,
      inputText: true,
    },
  })
}