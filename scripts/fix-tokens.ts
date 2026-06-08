import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const generations = await prisma.generation.findMany({
    where: { shareToken: null },
    select: { id: true },
  })

  console.log(`Found ${generations.length} generations without shareToken`)

  for (const gen of generations) {
    await prisma.generation.update({
      where: { id: gen.id },
      data: { shareToken: undefined }, // force Prisma à générer un cuid
    })
  }

  console.log("✅ Done!")
  await prisma.$disconnect()
}

main().catch(console.error)