"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"
import * as Sentry from "@sentry/nextjs"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex items-center justify-center h-full min-h-96">
      <div className="text-center max-w-sm">

        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Page failed to load
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Something went wrong loading this page. Please try again.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={reset}
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <RefreshCcw className="w-3.5 h-3.5 mr-1.5" />
            Retry
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}