import { CheckCircle2 } from "lucide-react"

import { ShareTournamentButton } from "@/components/landing/share-tournament-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SuccessMessage({
  playerName,
  confirmationEmailSent,
}: {
  playerName: string
  confirmationEmailSent: boolean
}) {
  return (
    <Alert className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
      <CheckCircle2 className="size-5 text-emerald-700" aria-hidden="true" />
      <AlertTitle className="text-xl font-black">
        Thanks, {playerName} is registered!
      </AlertTitle>
      <AlertDescription className="mt-2 text-base leading-7 text-emerald-900">
        {confirmationEmailSent
          ? "We have saved the registration and sent a confirmation email with the submitted details. It also explains how to withdraw if your plans change."
          : "We have saved the registration. A confirmation email could not be sent right now, but your place is booked."}
      </AlertDescription>
      <div className="mt-5">
        <p className="mb-3 text-sm font-bold text-emerald-900">
          Know another trainer who might want to join?
        </p>
        <ShareTournamentButton label="Share with friends" variant="compact" />
      </div>
    </Alert>
  )
}
