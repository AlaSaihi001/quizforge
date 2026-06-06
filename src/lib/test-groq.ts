import 'dotenv/config'  // ← Ajoute cette ligne au tout début
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

async function test() {
  console.log("🤖 Calling Groq...")

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: "You are a helpful educational assistant.",
      },
      {
        role: "user",
        content: "What is photosynthesis? Explain in 2 sentences.",
      },
    ],
  })

  console.log("✅ Response:", response.choices[0].message.content)
  console.log("📊 Tokens:", response.usage?.total_tokens)
}

test().catch(console.error)