"use client"

import { useActionState, useEffect, useRef, useState } from "react"

import { addParticipant } from "@/app/actions/admin/add-participant"
import { Button } from "@/components/ui/button"
import {
  experienceLevels,
  pokemonTypes,
} from "@/lib/validation/tournament-entry"

const fieldClass =
  "h-11 w-full rounded-xl border-2 border-slate-950 bg-white px-3 text-base font-bold text-slate-950 outline-none focus-visible:ring-4 focus-visible:ring-pokemon-blue/30"

const labelClass = "text-xs font-black uppercase tracking-wide text-slate-600"

export function AddParticipantForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [open, setOpen] = useState(false)

  const [state, formAction, isPending] = useActionState(
    async (
      _previous: { message: string; isError?: boolean } | null,
      formData: FormData
    ) => {
      const result = await addParticipant(formData)
      return {
        message: result.message,
        isError: !result.ok,
      }
    },
    null
  )

  useEffect(() => {
    if (state && !state.isError) {
      formRef.current?.reset()
      setShowLeaderboard(false)
    }
  }, [state])

  if (!open) {
    return (
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-12 w-fit rounded-full bg-pokemon-blue text-base font-black hover:bg-pokemon-blue/90"
      >
        + Add participant (on the day)
      </Button>
    )
  }

  return (
    <div className="rounded-[2rem] border-4 border-slate-950 bg-white p-6 shadow-[8px_8px_0_#2563eb]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-black text-slate-950">Add participant</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="h-9 rounded-full border-2 border-slate-950 text-sm font-black"
        >
          Close
        </Button>
      </div>
      <p className="mt-1 text-sm font-bold text-slate-600">
        Quick walk-in entry. Parent details are optional.
      </p>

      <form ref={formRef} action={formAction} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className={labelClass}>Player name</span>
            <input
              name="playerName"
              required
              autoComplete="off"
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Age</span>
            <input
              name="playerAge"
              type="number"
              min={5}
              max={17}
              required
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Experience level</span>
            <select name="experienceLevel" defaultValue="" required className={fieldClass}>
              <option value="" disabled>
                Choose…
              </option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className={labelClass}>Favourite Pokemon type</span>
            <select
              name="favouritePokemonType"
              defaultValue=""
              required
              className={fieldClass}
            >
              <option value="" disabled>
                Choose…
              </option>
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
          <label className="flex items-center gap-3 text-sm font-bold text-slate-800">
            <input
              type="checkbox"
              name="hasOwnDeck"
              className="size-5 rounded border-2 border-slate-950"
            />
            Bringing their own deck
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-slate-800">
            <input
              type="checkbox"
              name="showOnLeaderboard"
              checked={showLeaderboard}
              onChange={(event) => setShowLeaderboard(event.target.checked)}
              className="size-5 rounded border-2 border-slate-950"
            />
            Show on public leaderboard
          </label>
          {showLeaderboard ? (
            <label className="grid gap-1.5">
              <span className={labelClass}>Leaderboard nickname</span>
              <input
                name="leaderboardNickname"
                maxLength={30}
                className={fieldClass}
              />
            </label>
          ) : null}
        </div>

        <details className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-black text-slate-700">
            Parent / guardian details (optional)
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className={labelClass}>Parent name</span>
              <input name="parentName" autoComplete="off" className={fieldClass} />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Parent email</span>
              <input
                name="parentEmail"
                type="email"
                autoComplete="off"
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Parent phone</span>
              <input name="parentPhone" autoComplete="off" className={fieldClass} />
            </label>
          </div>
        </details>

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 rounded-full bg-pokemon-blue text-base font-black hover:bg-pokemon-blue/90"
          >
            {isPending ? "Adding…" : "Add participant"}
          </Button>
          {state?.message ? (
            <p
              className={
                state.isError
                  ? "rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-900"
                  : "rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900"
              }
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}
