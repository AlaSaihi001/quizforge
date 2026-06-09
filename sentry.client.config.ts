import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Pourcentage de transactions à tracer pour les performances
  // 0.1 = 10% en production pour ne pas surcharger
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Active le replay de session (voir ce que l'user faisait avant l'erreur)
  // 0.1 = 10% des sessions normales
  // 1.0 = 100% des sessions avec erreur
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // N'active le replay qu'en production
  integrations: process.env.NODE_ENV === "production"
    ? [Sentry.replayIntegration()]
    : [],

  // Cache les données sensibles
  beforeSend(event) {
    // Ne pas envoyer les erreurs en développement
    if (process.env.NODE_ENV === "development") return null
    return event
  },
})