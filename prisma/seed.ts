import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  await prisma.generation.deleteMany()
  await prisma.credit.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.user.deleteMany()

  const ala = await prisma.user.create({
    data: {
      email: "ala@test.com",
      name: "Ala Eddine",
      plan: "FREE",
      credits: { create: { total: 10, used: 3 } },
    },
  })

  const ahmed = await prisma.user.create({
    data: {
      email: "ahmed@test.com",
      name: "Ahmed Ben Ali",
      plan: "PRO",
      credits: { create: { total: 999, used: 0 } },
    },
  })

  await prisma.generation.createMany({
    data: [
      {
        userId: ala.id,
        inputText: "The French Revolution began in 1789...",
        outputText: JSON.stringify([{ question: "When did the French Revolution begin?", options: { A: "1789", B: "1799", C: "1776", D: "1804" }, correct_answer: "A", explanation: "The revolution began in 1789" }]),
        mode: "MCQ",
        language: "en",
      },
      {
        userId: ala.id,
        inputText: "Photosynthesis is the process by which plants convert sunlight into food...",
        outputText: JSON.stringify([{ question: "What is photosynthesis?", answer: "The process by which plants convert sunlight into food" }]),
        mode: "FLASHCARDS",
        language: "en",
      },
    ],
  })

  await prisma.generation.create({
    data: {
      userId: ahmed.id,
      inputText: "World War 2 started in 1939...",
      outputText: "World War 2 (1939-1945) began with Germany's invasion of Poland.",
      mode: "SUMMARY",
      language: "en",
    },
  })

  console.log("✅ Seed complete!")
  console.log(`Created users: ${ala.email}, ${ahmed.email}`)
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })