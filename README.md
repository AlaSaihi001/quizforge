# ⚡ QuizForge AI — AI-Powered Exam Prep Generator

> Turn your course content into MCQ quizzes, flashcards, and summaries in seconds using AI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![Stripe](https://img.shields.io/badge/Stripe-payments-635BFF?style=flat-square&logo=stripe)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-orange?style=flat-square)

---

## 📌 Overview

QuizForge AI is a full-stack SaaS application that allows students to paste any course content and instantly generate:

- 📝 **MCQ Quizzes** — 10 multiple choice questions with answers and explanations
- 🃏 **Flashcards** — Q&A pairs for active recall and spaced repetition
- 📋 **Summaries** — Structured key points and important terms

Built as a portfolio project to demonstrate production-level full-stack development skills.

**Live demo:** [quizforge-ai.vercel.app](https://quizforge-ai.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Email/password with NextAuth.js v4
- 🤖 **AI Generation** — Streaming responses via Groq (Llama 3.3 70B)
- 💳 **Stripe Payments** — Subscription billing with webhook handling
- 🎯 **Credit System** — 10 free generations/day with daily cron reset
- 🚦 **Rate Limiting** — Redis-based rate limiter (5 req/min) via Upstash
- 📄 **PDF Export** — Download formatted PDFs (PRO feature)
- 🔗 **Share Links** — Public shareable URLs for each generation
- 🌍 **Multi-language** — English, French, Arabic support
- 📱 **Responsive** — Mobile-first design with Tailwind CSS + shadcn/ui

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js Server Actions, API Routes |
| **Database** | PostgreSQL (Neon), Prisma ORM v5 |
| **AI** | Groq SDK — Llama 3.3 70B Versatile |
| **Auth** | NextAuth.js v4 — Credentials Provider |
| **Payments** | Stripe Checkout + Webhooks |
| **Cache / Rate Limit** | Upstash Redis |
| **Monitoring** | Sentry |
| **Deployment** | Vercel + Neon + Upstash |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (local or Neon)
- npm

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/quizforge.git
cd quizforge
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Fill in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quizforge?schema=public"

# Auth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI (free at console.groq.com)
GROQ_API_KEY="gsk_..."

# Redis (free at upstash.com)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Stripe (test mode keys from dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# Cron security
CRON_SECRET="any-random-string"
```

**4. Set up the database**

```bash
npx prisma migrate dev
npx prisma generate
```

**5. Seed the database (optional)**

```bash
npx prisma db seed
```

**6. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── api/             # API routes (generate, stripe, cron)
│   ├── dashboard/       # Protected dashboard pages
│   └── share/           # Public share pages
├── components/
│   ├── dashboard/       # Dashboard components
│   ├── landing/         # Landing page sections
│   ├── pdf/             # PDF templates
│   └── ui/              # shadcn/ui components
└── lib/
    ├── actions/         # Server Actions
    ├── db/              # Database queries
    ├── parsers.ts       # AI response parsers
    ├── prompts.ts       # AI prompt templates
    ├── prisma.ts        # Prisma client singleton
    ├── rate-limit.ts    # Rate limiter
    └── stripe.ts        # Stripe client
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Seed data
```

---

## 🔑 Key Implementation Details

### Streaming AI Responses
Groq responses stream token by token using `ReadableStream` and the Web Streams API — the same pattern used by ChatGPT.

### Credit System
Each generation atomically decrements credits using a `prisma.$transaction` — if the generation fails, credits are not consumed.

### Stripe Webhooks
Payment events are verified using HMAC signatures and handled idempotently — the same event can be received multiple times safely.

### Rate Limiting
Upstash Redis sliding window algorithm prevents abuse — max 5 requests per 60 seconds per user, checked before any DB query.

---

## 🌐 Deployment

The app is deployed on **Vercel** with:
- **Neon** for PostgreSQL database
- **Upstash** for Redis rate limiting
- **Vercel Cron** for daily credit reset at midnight

---

## 📄 License

MIT — feel free to use this project as a reference for your own learning.

---

Built by **Ala Eddine Saihi** · [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)
