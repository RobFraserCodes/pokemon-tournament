"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { registerTournamentEntry } from "@/app/actions/register-entry"
import { SuccessMessage } from "@/components/landing/success-message"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  experienceLevels,
  tournamentEntrySchema,
  type TournamentEntryInput,
} from "@/lib/validation/tournament-entry"

export function TournamentSignupForm() {
  const [isPending, startTransition] = useTransition()
  const [successPlayerName, setSuccessPlayerName] = useState<string | null>(
    null
  )
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<TournamentEntryInput>({
    resolver: zodResolver(tournamentEntrySchema),
    defaultValues: {
      playerName: "",
      playerAge: undefined,
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      experienceLevel: "New Player",
      notes: "",
      consent: false,
    },
  })

  function onSubmit(values: TournamentEntryInput) {
    setServerError(null)
    startTransition(async () => {
      const result = await registerTournamentEntry(values)

      if (result.ok) {
        setSuccessPlayerName(result.playerName)
        form.reset()
        return
      }

      setServerError(result.message)
    })
  }

  return (
    <section
      className="bg-[linear-gradient(180deg,#fefce8_0%,#ffffff_100%)] py-16 sm:py-20"
      id="registration"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Registration
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            Save a place at the table
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Register one child at a time. We will use parent details only for
            tournament updates, safety notes, and any schedule changes.
          </p>
        </div>

        <Card className="rounded-[2rem] border-4 border-slate-950 bg-white shadow-[8px_8px_0_#2563eb]">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-slate-950">
              Player registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {successPlayerName ? (
              <SuccessMessage playerName={successPlayerName} />
            ) : (
              <Form {...form}>
                <form
                  className="grid gap-5"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="playerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="playerName">
                            Player Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="playerName"
                              autoComplete="off"
                              className="h-12 rounded-2xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage name="playerName" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="playerAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="playerAge">Player Age</FormLabel>
                          <FormControl>
                            <Input
                              id="playerAge"
                              inputMode="numeric"
                              type="number"
                              min={5}
                              max={17}
                              className="h-12 rounded-2xl"
                              {...field}
                              value={field.value ?? ""}
                              onChange={(event) => {
                                const value = event.target.value
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                )
                              }}
                            />
                          </FormControl>
                          <FormMessage name="playerAge" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="parentName">
                            Parent / Guardian Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="parentName"
                              autoComplete="name"
                              className="h-12 rounded-2xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage name="parentName" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="parentEmail">
                            Parent Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="parentEmail"
                              type="email"
                              autoComplete="email"
                              className="h-12 rounded-2xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage name="parentEmail" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="parentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="parentPhone">
                            Parent Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="parentPhone"
                              type="tel"
                              autoComplete="tel"
                              className="h-12 rounded-2xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage name="parentPhone" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 w-full rounded-2xl">
                                <SelectValue placeholder="Choose level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage name="experienceLevel" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="notes">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            id="notes"
                            className="min-h-28 rounded-2xl"
                            placeholder="Accessibility needs, sibling registrations, deck questions..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional notes help organisers make the day smoother.
                        </FormDescription>
                        <FormMessage name="notes" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="consent"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                          <div>
                            <FormLabel
                              htmlFor="consent"
                              className="leading-6 text-slate-950"
                            >
                              I confirm I am the parent/guardian of this
                              participant.
                            </FormLabel>
                            <FormMessage name="consent" />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  {serverError ? (
                    <Alert className="rounded-2xl border-red-200 bg-red-50 text-red-950">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-14 rounded-full bg-red-600 text-base font-black text-white shadow-lg hover:bg-red-700"
                  >
                    {isPending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                    Register for Tournament
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
