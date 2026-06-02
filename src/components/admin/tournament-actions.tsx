"use client"

import { useActionState } from "react"

import { createNextRound, completeTournament } from "@/app/actions/admin/tournament"
import { Button } from "@/components/ui/button"

function ActionMessage({
  message,
  isError,
}: {
  message: string | null
  isError?: boolean
}) {
  if (!message) {
    return null
  }

  return (
    <p
      className={
        isError
          ? "rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-900"
          : "rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900"
      }
    >
      {message}
    </p>
  )
}

export function CreateRoundForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, isPending] = useActionState(
    async (_previous: { message: string; isError?: boolean } | null) => {
      const result = await createNextRound()
      return {
        message: result.message,
        isError: !result.ok,
      }
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-3">
      <Button
        type="submit"
        disabled={disabled || isPending}
        className="h-12 rounded-full bg-pokemon-blue text-base font-black hover:bg-pokemon-blue/90"
      >
        {isPending ? "Creating draw..." : "Create next round draw"}
      </Button>
      <ActionMessage
        message={state?.message ?? null}
        isError={state?.isError}
      />
    </form>
  )
}

export function CompleteTournamentForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, isPending] = useActionState(
    async (_previous: { message: string; isError?: boolean } | null) => {
      const result = await completeTournament()
      return {
        message: result.message,
        isError: !result.ok,
      }
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-3">
      <Button
        type="submit"
        disabled={disabled || isPending}
        variant="outline"
        className="h-12 rounded-full border-2 border-slate-950 text-base font-black"
      >
        {isPending ? "Saving..." : "Mark tournament complete"}
      </Button>
      <ActionMessage
        message={state?.message ?? null}
        isError={state?.isError}
      />
    </form>
  )
}
