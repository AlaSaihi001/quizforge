import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { stripe, getBaseUrl } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {

  // ── 1. AUTH ───────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  // ── 2. RÉCUPÉRER L'ABONNEMENT DE L'USER ──────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  })

  if (!user?.subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "NO_SUBSCRIPTION" },
      { status: 400 }
    )
  }

  try {
    // ── 3. CRÉER UNE SESSION PORTAL ───────────────────────────────────────
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      // URL de retour après que l'user a fermé le portal
      return_url: `${getBaseUrl()}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Portal error:", error)
    return NextResponse.json(
      { error: "STRIPE_ERROR", message: error.message },
      { status: 500 }
    )
  }
}