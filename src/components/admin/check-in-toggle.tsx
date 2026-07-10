"use client"

import { useActionState } from "react"

import { setPlayerCheckIn } from "@/app/actions/admin/check-in"
import { Button } from "@/components/ui/button"

export function CheckInToggle({
  entryId,
  checkedIn,
}: {
  entryId: string
  checkedIn: boolean
}) {
  const [state, formAction, isPending] = useActionState(
    async (
      _previous: { message: string; isError?: boolean } | null,
      formData: FormData
    ) => {
      const result = await setPlayerCheckIn(formData)
      return {
        message: result.message,
        isError: !result.ok,
      }
    },
    null
  )

  return (
    <form action={formAction} className="grid gap-2">
      <input name="entryId" type="hidden" value={entryId} />
      <input
        name="checkedIn"
        type="hidden"
        value={checkedIn ? "false" : "true"}
      />
      <Button
        type="submit"
        disabled={isPending}
        variant={checkedIn ? "outline" : "default"}
        className={
          checkedIn
            ? "h-10 rounded-full border-2 border-emerald-600 bg-emerald-50 px-4 text-sm font-black text-emerald-800 hover:bg-emerald-100"
            : "h-10 rounded-full bg-slate-950 px-4 text-sm font-black hover:bg-forest"
        }
      >
        {isPending
          ? "Saving..."
          : checkedIn
            ? "Signed in"
            : "Sign in"}
      </Button>
      {state?.isError ? (
        <p className="max-w-[10rem] text-xs font-bold leading-5 text-red-700">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
