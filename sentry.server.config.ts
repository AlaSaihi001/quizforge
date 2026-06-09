import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Ignore certaines erreurs connues et non critiques
  ignoreErrors: [
    "NEXT_NOT_FOUND",           // 404 normaux
    "NEXT_REDIRECT",            // Redirections normales
    "AuthSessionMissingError",  // Session expirée
  ],
})