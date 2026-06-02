import { CheckCircle2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SuccessMessage({ playerName }: { playerName: string }) {
  return (
    <Alert className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
      <CheckCircle2 className="size-5 text-emerald-700" aria-hidden="true" />
      <AlertTitle className="text-xl font-black">
        Thanks, {playerName} is registered!
      </AlertTitle>
      <AlertDescription className="mt-2 text-base leading-7 text-emerald-900">
        We have saved the registration. A parent or guardian will receive event
        details, final timings, and any deck reminders before tournament day.
      </AlertDescription>
    </Alert>
  )
}
