"use client"

import { useActionState, useState } from "react"

import {
  createNextRound,
  completeTournament,
  resetLeaderboard,
} from "@/app/actions/admin/tournament"
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

export function ResetLeaderboardForm() {
  const [confirming, setConfirming] = useState(false)
  const [state, formAction, isPending] = useActionState(
    async (_previous: { message: string; isError?: boolean } | null) => {
      const result = await resetLeaderboard()
      if (result.ok) {
        setConfirming(false)
      }
      return {
        message: result.message,
        isError: !result.ok,
      }
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-3">
      {confirming ? (
        <div className="grid gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-900">
            This deletes all rounds and match results. Entrants are kept and the
            tournament returns to round 0. This cannot be undone.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 rounded-full bg-pokemon-red text-base font-black hover:bg-pokemon-red/90"
            >
              {isPending ? "Resetting..." : "Yes, reset leaderboard"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setConfirming(false)}
              className="h-12 rounded-full border-2 border-slate-950 text-base font-black"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirming(true)}
          className="h-12 rounded-full border-2 border-pokemon-red text-base font-black text-pokemon-red hover:bg-pokemon-red/10"
        >
          Reset leaderboard (keep entrants)
        </Button>
      )}
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
