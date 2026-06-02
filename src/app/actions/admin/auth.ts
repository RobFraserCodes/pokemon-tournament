"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  isValidAdminPassword,
} from "@/lib/admin/session"

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "")

  if (!isValidAdminPassword(password)) {
    return { ok: false as const, message: "Incorrect admin password." }
  }

  await createAdminSession()
  redirect("/admin/registrations")
}

export async function logoutAdmin() {
  await clearAdminSession()
  redirect("/admin/login")
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login")
  }
}

export async function revalidateTournamentPages() {
  revalidatePath("/leaderboard")
  revalidatePath("/admin/registrations")
  revalidatePath("/admin/tournament")
}
