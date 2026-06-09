/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

// Types d'erreurs de l'app
export type AppError =
  | "UNAUTHORIZED"
  | "USER_NOT_FOUND"
  | "NO_CREDITS"
  | "RATE_LIMITED"
  | "TEXT_TOO_SHORT"
  | "INVALID_MODE"
  | "STRIPE_ERROR"
  | "GENERATION_FAILED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR"

// Messages lisibles pour chaque erreur
export const errorMessages: Record<AppError, string> = {
  UNAUTHORIZED: "You must be logged in.",
  USER_NOT_FOUND: "User not found.",
  NO_CREDITS: "No credits remaining today.",
  RATE_LIMITED: "Too many requests. Please slow down.",
  TEXT_TOO_SHORT: "Please enter at least 50 characters.",
  INVALID_MODE: "Invalid generation mode.",
  STRIPE_ERROR: "Payment error. Please try again.",
  GENERATION_FAILED: "AI generation failed. Please try again.",
  NOT_FOUND: "Resource not found.",
  INTERNAL_ERROR: "Something went wrong on our end.",
}

// Status HTTP pour chaque erreur
const errorStatuses: Record<AppError, number> = {
  UNAUTHORIZED: 401,
  USER_NOT_FOUND: 404,
  NO_CREDITS: 402,
  RATE_LIMITED: 429,
  TEXT_TOO_SHORT: 400,
  INVALID_MODE: 400,
  STRIPE_ERROR: 500,
  GENERATION_FAILED: 500,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

// Fonction helper pour retourner une erreur structurée
export function apiError(
  error: AppError,
  extra?: Record<string, any>
): NextResponse {
  const status = errorStatuses[error]

  // Log les erreurs serveur dans Sentry
  if (status >= 500) {
    Sentry.captureMessage(`API Error: ${error}`, {
      level: "error",
      extra,
    })
  }

  return NextResponse.json(
    {
      error,
      message: errorMessages[error],
      ...extra,
    },
    { status }
  )
}

// Wrapper pour capturer les erreurs inattendues dans les API routes
export function withErrorHandler(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req)
    } catch (error: any) {
      Sentry.captureException(error)
      console.error("Unhandled API error:", error)
      return apiError("INTERNAL_ERROR")
    }
  }
}