import { z } from "zod"

export const experienceLevels = [
  "New Player",
  "Casual Player",
  "Tournament Player",
] as const

export const pokemonTypes = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
] as const

export const tournamentEntrySchema = z
  .object({
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
    favouritePokemonType: z.enum(pokemonTypes, {
      error: "Choose a favourite Pokemon type.",
    }),
    notes: z
      .string()
      .trim()
      .max(1000, "Notes must be 1000 characters or fewer.")
      .optional()
      .or(z.literal("")),
    hasOwnDeck: z.boolean(),
    showOnLeaderboard: z.boolean(),
    leaderboardNickname: z
      .string()
      .trim()
      .max(30, "Nickname must be 30 characters or fewer.")
      .optional()
      .or(z.literal("")),
    consent: z
      .boolean()
      .refine((value) => value, "Confirm you are the parent or guardian."),
  })
  .superRefine((data, ctx) => {
    if (!data.showOnLeaderboard) {
      return
    }

    if (!data.leaderboardNickname || data.leaderboardNickname.length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["leaderboardNickname"],
        message: "Enter a nickname for the public leaderboard.",
      })
    }
  })

export type TournamentEntryInput = z.infer<typeof tournamentEntrySchema>
