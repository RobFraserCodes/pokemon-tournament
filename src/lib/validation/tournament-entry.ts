import { z } from "zod"

export const experienceLevels = [
  "New Player",
  "Casual Player",
  "Tournament Player",
] as const

export const tournamentEntrySchema = z.object({
  playerName: z
    .string()
    .trim()
    .min(2, "Enter the player's name.")
    .max(80, "Player name must be 80 characters or fewer."),
  playerAge: z
    .number({ error: "Enter the player's age." })
    .int("Age must be a whole number.")
    .min(5, "Players must be at least 5.")
    .max(17, "This event is for children aged 17 or under."),
  parentName: z
    .string()
    .trim()
    .min(2, "Enter the parent or guardian name.")
    .max(100, "Parent or guardian name must be 100 characters or fewer."),
  parentEmail: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(120, "Email must be 120 characters or fewer."),
  parentPhone: z
    .string()
    .trim()
    .max(40, "Phone number must be 40 characters or fewer.")
    .optional()
    .or(z.literal("")),
  experienceLevel: z.enum(experienceLevels, {
    error: "Choose an experience level.",
  }),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be 1000 characters or fewer.")
    .optional()
    .or(z.literal("")),
  hasOwnDeck: z.boolean(),
  consent: z
    .boolean()
    .refine((value) => value, "Confirm you are the parent or guardian."),
})

export type TournamentEntryInput = z.infer<typeof tournamentEntrySchema>
