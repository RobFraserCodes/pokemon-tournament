"use client"

import { useActionState } from "react"

import { loginAdmin } from "@/app/actions/admin/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (_previous: { message: string } | null, formData: FormData) => {
      const result = await loginAdmin(formData)
      return result ?? null
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-4">
      <div>
        <label
          className="mb-2 block text-sm font-black text-slate-950"
          htmlFor="password"
        >
          Admin password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="h-12 rounded-2xl"
          required
        />
      </div>
      {state?.message ? (
        <p className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-900">
          {state.message}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-full bg-slate-950 text-base font-black hover:bg-forest"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
