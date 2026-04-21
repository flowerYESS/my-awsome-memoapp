import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAuthToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      )
    }

    const token = await createAuthToken({ userId: user.id, email: user.email })
    await setAuthCookie(token)

    return NextResponse.json({ user: { id: user.id, email: user.email } })
  } catch {
    return NextResponse.json(
      { message: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
