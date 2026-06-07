import 'dotenv/config'  // ← Ajoute cette ligne
import { Redis } from "@upstash/redis"

// Client Redis singleton — une seule instance dans toute l'app
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// ── FONCTIONS UTILITAIRES ────────────────────────────────────────────────────

// Clé unique par utilisateur pour le rate limit
// Ex: "ratelimit:user_abc123"
export function getRateLimitKey(userId: string): string {
  return `ratelimit:${userId}`
}

// Clé pour le compteur de requêtes
// Ex: "requests:user_abc123:2024-01-15"
export function getDailyRequestKey(userId: string): string {
  const today = new Date().toISOString().split("T")[0] // "2024-01-15"
  return `requests:${userId}:${today}`
}