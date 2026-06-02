"use client"

import { useActionState } from "react"

import { recordMatchResult } from "@/app/actions/admin/tournament"
import { Button } from "@/components/ui/button"

export function RecordMatchForm({
  matchId,
  playerA,
  playerB,
}: {
  matchId: string
  playerA: string
  playerB: string
}) {
  const [state, formAction, isPending] = useActionState(
    async (_previous: { message: string; isError?: boolean } | null, formData: FormData) => {
      const result = await recordMatchResult(formData)
      return {
        message: result.message,
        isError: !result.ok,
      }
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-3">
      <input name="matchId" type="hidden" value={matchId} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          name="result"
          value="a"
          disabled={isPending}
          className="h-11 flex-1 rounded-full bg-emerald-600 text-sm font-black hover:bg-emerald-700"
        >
          {playerA} wins
        </Button>
        <Button
          type="submit"
          name="result"
          value="b"
          disabled={isPending}
          className="h-11 flex-1 rounded-full bg-emerald-600 text-sm font-black hover:bg-emerald-700"
        >
          {playerB} wins
        </Button>
        <Button
          type="submit"
          name="result"
          value="draw"
          disabled={isPending}
          variant="outline"
          className="h-11 flex-1 rounded-full border-2 border-slate-950 text-sm font-black"
        >
          Draw
        </Button>
      </div>
      {state?.message ? (
        <p
          className={
            state.isError
              ? "rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-900"
              : "rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
