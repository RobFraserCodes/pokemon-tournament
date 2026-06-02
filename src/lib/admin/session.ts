import { createHmac, randomBytes, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "loch_ness_admin_session"

function getAdminSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET or ADMIN_PASSWORD.")
  }

  return secret
}

function signToken(token: string) {
  return createHmac("sha256", getAdminSecret()).update(token).digest("hex")
}

export async function createAdminSession() {
  const token = randomBytes(32).toString("hex")
  const signature = signToken(token)
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, `${token}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIE_NAME)?.value

  if (!value) {
    return false
  }

  const [token, signature] = value.split(".")

  if (!token || !signature) {
    return false
  }

  try {
    const expected = signToken(token)
    const actual = Buffer.from(signature, "hex")
    const expectedBuffer = Buffer.from(expected, "hex")

    if (actual.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(actual, expectedBuffer)
  } catch {
    return false
  }
}

export function isValidAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD

  if (!configuredPassword) {
    return false
  }

  const provided = Buffer.from(password)
  const expected = Buffer.from(configuredPassword)

  if (provided.length !== expected.length) {
    return false
  }

  return timingSafeEqual(provided, expected)
}
