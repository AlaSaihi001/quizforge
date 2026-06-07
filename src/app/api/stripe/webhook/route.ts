import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: NextRequest) {

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log("✅ Event:", event.type)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Signature failed:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        console.log("🛒 checkout.session.completed received")

        const session = event.data.object as Stripe.Checkout.Session
        console.log("Session metadata:", session.metadata)
        console.log("Session subscription:", session.subscription)
        console.log("Session customer:", session.customer)

        if (!session.subscription) {
          console.error("❌ No subscription in session")
          break
        }

        // Récupère l'abonnement depuis Stripe
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        console.log("Subscription retrieved:", subscription.id)
        console.log("Subscription metadata:", subscription.metadata)

        // userId depuis les metadata de la session
        const userId = session.metadata?.userId
        console.log("userId from metadata:", userId)

        if (!userId) {
          console.error("❌ No userId in metadata")
          break
        }

        const priceId = subscription.items.data[0].price.id

        // ── FIX PRINCIPAL ────────────────────────────────────────────────────
        // current_period_end a changé de place selon la version Stripe
        // On cast en any pour être compatible avec toutes les versions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = subscription as any
        const periodEndTimestamp =
          sub.current_period_end ??                      // ancienne API
          sub.items?.data?.[0]?.current_period_end ??   // nouvelle API
          sub.billing_cycle_anchor ??                    // fallback
          Math.floor(Date.now() / 1000) + 30 * 24 * 3600 // dernier fallback : +30 jours

        const currentPeriodEnd = new Date(periodEndTimestamp * 1000)
        console.log("Period end:", currentPeriodEnd)

        // Vérifie que le user existe
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { credits: true }
        })

        if (!user) {
          console.error("❌ User not found:", userId)
          break
        }

        console.log("User found:", user.email, "| Plan:", user.plan)

        // Transaction DB
        await prisma.$transaction(async (tx) => {

          // 1. User → PRO
          await tx.user.update({
            where: { id: userId },
            data: { plan: "PRO" },
          })
          console.log("✅ User plan → PRO")

          // 2. Subscription — upsert
          await tx.subscription.upsert({
            where: { userId },
            update: {
              stripeCustomerId: session.customer as string,
              stripePriceId: priceId,
              stripeSubId: subscription.id,
              status: subscription.status,
              currentPeriodEnd,
            },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripePriceId: priceId,
              stripeSubId: subscription.id,
              status: subscription.status,
              currentPeriodEnd,
            },
          })
          console.log("✅ Subscription upserted")

          // 3. Credits → illimités
          await tx.credit.upsert({
            where: { userId },
            update: { total: 99999, used: 0 },
            create: { userId, total: 99999, used: 0 },
          })
          console.log("✅ Credits → 99999")
        })

        console.log("🎉 User", userId, "upgraded to PRO successfully!")
        break
      }

      case "customer.subscription.updated": {
        console.log("🔄 subscription.updated")
        const subscription = event.data.object as Stripe.Subscription
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = subscription as any
        const periodEndTimestamp =
          sub.current_period_end ??
          sub.items?.data?.[0]?.current_period_end ??
          Math.floor(Date.now() / 1000) + 30 * 24 * 3600

        try {
          await prisma.subscription.update({
            where: { stripeSubId: subscription.id },
            data: {
              status: subscription.status,
              currentPeriodEnd: new Date(periodEndTimestamp * 1000),
              stripePriceId: subscription.items.data[0].price.id,
            },
          })
          console.log("✅ Subscription updated")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.warn("⚠️ Could not update subscription:", err.message)
        }
        break
      }

      case "customer.subscription.deleted": {
        console.log("❌ subscription.deleted")
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error("❌ No userId in subscription metadata")
          break
        }

        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: userId },
            data: { plan: "FREE" },
          })

          try {
            await tx.subscription.delete({
              where: { stripeSubId: subscription.id },
            })
          } catch {
            console.warn("⚠️ Subscription record not found to delete")
          }

          await tx.credit.upsert({
            where: { userId },
            update: { total: 10, used: 0 },
            create: { userId, total: 10, used: 0 },
          })
        })

        console.log("✅ User", userId, "downgraded to FREE")
        break
      }

      default:
        console.log("⏭️ Unhandled:", event.type)
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Handler error:", error.message)
    console.error(error.stack)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}