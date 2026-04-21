import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const COOKIE_NAME = "memoapp_session"
const encoder = new TextEncoder()
const rawSecret = process.env.AUTH_SECRET ?? "dev-secret-change-me"
const secret = encoder.encode(rawSecret)

interface AuthTokenPayload {
  userId: string
  email: string
}

export async function createAuthToken(payload: AuthTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, secret)
  const userId = payload.userId
  const email = payload.email

  if (typeof userId !== "string" || typeof email !== "string") {
    throw new Error("Invalid auth token payload")
  }

  return { userId, email }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    return await verifyAuthToken(token)
  } catch {
    return null
  }
}
