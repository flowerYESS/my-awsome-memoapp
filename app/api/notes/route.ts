import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const authUser = await getAuthUser()
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const notes = await prisma.note.findMany({
    where: { userId: authUser.userId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ notes })
}

export async function POST(request: Request) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const title = String(body.title ?? "").trim()
    const content = String(body.content ?? "").trim()
    const color = String(body.color ?? "pink").trim() || "pink"

    if (!title && !content) {
      return NextResponse.json(
        { message: "제목 또는 내용을 입력해주세요." },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        color,
        userId: authUser.userId,
      },
    })

    return NextResponse.json({ note })
  } catch {
    return NextResponse.json(
      { message: "메모 생성 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
