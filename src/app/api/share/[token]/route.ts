import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params

  if (!token) {
    return NextResponse.json({ error: "NO_TOKEN" }, { status: 400 })
  }

  try {
    const generation = await prisma.generation.findUnique({
      where: { shareToken: token },
      select: {
        id: true,
        outputText: true,
        mode: true,
        language: true,
        createdAt: true,
        // On ne retourne PAS : userId, inputText (privacy)
      },
    })

    if (!generation) {
      return NextResponse.json(
        { error: "NOT_FOUND" },
        { status: 404 }
      )
    }

    return NextResponse.json(generation)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Share API error:", error)
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}