"use server" // ← cette directive transforme le fichier en Server Actions

import { prisma } from "@/lib/prisma"

// Cette fonction s'exécute sur le SERVEUR même si appelée depuis le client
export async function getStats() {
  const userCount = await prisma.user.count()
  const generationCount = await prisma.generation.count()
  
  return {
    users: userCount,
    generations: generationCount,
  }
}