import 'dotenv/config'  // ← Ajoute cette ligne
import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"

// ── RATE LIMITER PRINCIPAL ───────────────────────────────────────────────────
// Sliding Window = fenêtre glissante
// Ex avec 5 req/60s :
//   - 12:00:00 → req 1 ✅
//   - 12:00:10 → req 2 ✅
//   - 12:00:20 → req 3 ✅
//   - 12:00:30 → req 4 ✅
//   - 12:00:40 → req 5 ✅
//   - 12:00:50 → req 6 ❌ bloqué (5 req dans les 60 dernières secondes)
//   - 12:01:05 → req 6 ✅ (req 1 a expiré, on est à 4 req dans la fenêtre)

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  // 5 requêtes maximum par fenêtre de 60 secondes
  analytics: true, // active les analytics dans le dashboard Upstash
  prefix: "quizforge_rl", // préfixe pour identifier nos clés dans Redis
})

// ── FONCTION DE VÉRIFICATION ──────────────────────────────────────────────────
export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  reset: number // timestamp en ms quand le rate limit se reset
}> {
  // identifier = clé unique par user
  const { success, remaining, reset } = await rateLimiter.limit(userId)

  return {
    allowed: success,
    remaining,
    reset,
  }
}