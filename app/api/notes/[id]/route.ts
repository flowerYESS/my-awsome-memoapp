import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: Params) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params

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

    const existing = await prisma.note.findFirst({
      where: {
        id,
        userId: authUser.userId,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { message: "메모를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const note = await prisma.note.update({
      where: { id: existing.id },
      data: { title, content, color },
    })

    return NextResponse.json({ note })
  } catch {
    return NextResponse.json(
      { message: "메모 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, context: Params) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await context.params
  await prisma.note.deleteMany({
    where: {
      id,
      userId: authUser.userId,
    },
  })

  return NextResponse.json({ ok: true })
}
