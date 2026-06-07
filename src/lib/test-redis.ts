import 'dotenv/config'  // ← Ajoute cette ligne
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

async function test() {
  console.log("🔴 Testing Redis connection...")

  // SET — stocker une valeur avec expiration
  await redis.set("test_key", "hello quizforge", { ex: 60 })
  // ex: 60 = expire après 60 secondes

  // GET — récupérer la valeur
  const value = await redis.get("test_key")
  console.log("✅ Value stored and retrieved:", value)

  // INCR — incrémenter un compteur (utilisé pour le rate limiting)
  await redis.set("counter", 0)
  await redis.incr("counter")
  await redis.incr("counter")
  const count = await redis.get("counter")
  console.log("✅ Counter after 2 increments:", count)

  // DEL — supprimer
  await redis.del("test_key", "counter")
  console.log("✅ Keys deleted")
  console.log("✅ Redis works perfectly!")
}

test().catch(console.error)