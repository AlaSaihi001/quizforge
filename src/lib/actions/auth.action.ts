"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return { error: "Email already in use" }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { name, email, password: hashedPassword },
    })

    await tx.credit.create({
      data: { userId: newUser.id, total: 10, used: 0 },
    })

    return newUser
  })

  return { success: true, userId: user.id }
}