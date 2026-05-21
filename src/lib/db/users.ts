import { prisma } from "@/lib/prisma"
import { Plan } from "@prisma/client"

// ─── GET USER BY ID ───────────────────────────────────────────────────────────
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      credits: true,
      subscription: true,
    },
  })
}

// ─── GET USER BY EMAIL ────────────────────────────────────────────────────────
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      credits: true,
    },
  })
}

// ─── CREATE USER (with credit record) ────────────────────────────────────────
export async function createUser({
  email,
  name,
  image,
  password,
}: {
  email: string
  name?: string
  image?: string
  password?: string
}) {
  // Use a transaction: user + credit created together, or neither
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name,
        image,
        password,
      },
    })

    await tx.credit.create({
      data: {
        userId: user.id,
        total: 10,
        used: 0,
        resetAt: new Date(),
      },
    })

    return user
  })
}

// ─── UPDATE USER PLAN ─────────────────────────────────────────────────────────
export async function updateUserPlan(userId: string, plan: Plan) {
  return prisma.user.update({
    where: { id: userId },
    data: { plan },
  })
}

// ─── CHECK IF USER IS PRO ─────────────────────────────────────────────────────
export async function isUserPro(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })
  return user?.plan === Plan.PRO
}

// ─── DELETE USER ──────────────────────────────────────────────────────────────
export async function deleteUser(userId: string) {
  // onDelete: Cascade handles related records automatically
  return prisma.user.delete({
    where: { id: userId },
  })
}