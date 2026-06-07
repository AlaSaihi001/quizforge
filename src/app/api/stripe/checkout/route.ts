import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { stripe, getBaseUrl } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {

  // ── 1. VÉRIFIER L'AUTH ────────────────────────────────────────────────────
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
  }

  // ── 2. RÉCUPÉRER L'UTILISATEUR ────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true },
  })

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 })
  }

  // ── 3. VÉRIFIER SI DÉJÀ PRO ───────────────────────────────────────────────
  // Un user déjà PRO ne devrait pas pouvoir payer à nouveau
  if (user.plan === "PRO") {
    return NextResponse.json(
      { error: "ALREADY_PRO" },
      { status: 400 }
    )
  }

  const baseUrl = getBaseUrl()

  try {
    // ── 4. CRÉER OU RÉCUPÉRER LE CUSTOMER STRIPE ──────────────────────────
    // Stripe garde un "Customer" pour chaque utilisateur
    // Ça permet de retrouver ses paiements, abonnements, etc.
    let customerId = user.subscription?.stripeCustomerId

    if (!customerId) {
      // Crée un nouveau customer Stripe
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name || undefined,
        metadata: {
          // On stocke notre userId pour le retrouver dans le webhook
          userId: user.id,
        },
      })
      customerId = customer.id
    }

    // ── 5. CRÉER LA SESSION CHECKOUT ──────────────────────────────────────
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,

      mode: "subscription", // "subscription" = abonnement récurrent
                            // "payment" = paiement unique

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // Price ID de ton produit Stripe
          quantity: 1,
        },
      ],

      // URL de redirection après paiement réussi
      // ?session_id={CHECKOUT_SESSION_ID} permet de récupérer les détails
      success_url: `${baseUrl}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,

      // URL de redirection si l'user annule
      cancel_url: `${baseUrl}/dashboard?canceled=true`,

      // Email pré-rempli dans le formulaire Stripe
      customer_email: !customerId ? user.email! : undefined,

      // Métadonnées — on les retrouvera dans le webhook
      metadata: {
        userId: user.id,
      },

      // Options d'abonnement
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },

      // Permet à l'user de modifier la quantité (non dans notre cas)
      allow_promotion_codes: true, // codes promo Stripe acceptés
    })

    // Retourne l'URL de la page Stripe
    return NextResponse.json({ url: checkoutSession.url })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "STRIPE_ERROR", message: error.message },
      { status: 500 }
    )
  }
}