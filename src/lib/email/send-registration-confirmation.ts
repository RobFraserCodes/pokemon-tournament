import { SendMailClient } from "zeptomail"

import { tournamentEvent } from "@/lib/event-details"
import type { TournamentEntryInput } from "@/lib/validation/tournament-entry"

type SendRegistrationConfirmationResult =
  | { ok: true }
  | { ok: false; reason: string }

function getEmailConfig() {
  const apiKey = process.env.ZEPTOMAIL_API_KEY
  const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL
  const fromName = process.env.ZEPTOMAIL_FROM_NAME || tournamentEvent.name
  const contactEmail = process.env.TOURNAMENT_CONTACT_EMAIL

  if (!apiKey || !fromEmail || !contactEmail) {
    return null
  }

  return { apiKey, fromEmail, fromName, contactEmail }
}

function formatOptional(value: string | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : "None provided"
}

function buildPlainTextEmail(
  entry: TournamentEntryInput,
  contactEmail: string
) {
  return [
    `Hi ${entry.parentName},`,
    "",
    `Thanks for registering ${entry.playerName} for the ${tournamentEvent.name}.`,
    "",
    "Registration details",
    "--------------------",
    `Player name: ${entry.playerName}`,
    `Player age: ${entry.playerAge}`,
    `Experience level: ${entry.experienceLevel}`,
    `Favourite Pokemon type: ${entry.favouritePokemonType}`,
    `Own 60-card deck: ${entry.hasOwnDeck ? "Yes" : "No"}`,
    `Public leaderboard: ${entry.showOnLeaderboard ? "Opted in" : "Opted out"}`,
    `Leaderboard nickname: ${entry.showOnLeaderboard ? entry.leaderboardNickname : "Not shown"}`,
    `Parent / guardian: ${entry.parentName}`,
    `Parent email: ${entry.parentEmail}`,
    `Parent phone: ${formatOptional(entry.parentPhone)}`,
    `Additional notes: ${formatOptional(entry.notes)}`,
    "",
    "Event details",
    "-------------",
    `Date: ${tournamentEvent.date}`,
    `Time: ${tournamentEvent.time}`,
    `Venue: ${tournamentEvent.venue}`,
    `Entry: ${tournamentEvent.entry}`,
    "",
    "Match pairings will be made before the tournament starts on the day.",
    "",
    `If you need to withdraw, please email ${contactEmail} as soon as possible.`,
    "",
    "See you at the tournament!",
  ].join("\n")
}

function buildHtmlEmail(entry: TournamentEntryInput, contactEmail: string) {
  const rows = [
    ["Player name", entry.playerName],
    ["Player age", String(entry.playerAge)],
    ["Experience level", entry.experienceLevel],
    ["Favourite Pokemon type", entry.favouritePokemonType],
    ["Own 60-card deck", entry.hasOwnDeck ? "Yes" : "No"],
    ["Public leaderboard", entry.showOnLeaderboard ? "Opted in" : "Opted out"],
    [
      "Leaderboard nickname",
      entry.showOnLeaderboard ? entry.leaderboardNickname : "Not shown",
    ],
    ["Parent / guardian", entry.parentName],
    ["Parent email", entry.parentEmail],
    ["Parent phone", formatOptional(entry.parentPhone)],
    ["Additional notes", formatOptional(entry.notes)],
  ]

  const registrationRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 12px 8px 0;color:#475569;font-weight:600;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;color:#0f172a;">${value}</td>
        </tr>`
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f5f3e8;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:3px solid #0f172a;border-radius:24px;padding:32px;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;">Registration confirmed</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">${tournamentEvent.name}</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#334155;">Hi ${entry.parentName}, thanks for registering <strong>${entry.playerName}</strong>. Here is a summary of the details we received.</p>

      <h2 style="margin:0 0 12px;font-size:18px;">Registration details</h2>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:15px;line-height:1.5;">${registrationRows}</table>

      <h2 style="margin:0 0 12px;font-size:18px;">Event details</h2>
      <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.7;color:#334155;">
        <li><strong>Date:</strong> ${tournamentEvent.date}</li>
        <li><strong>Time:</strong> ${tournamentEvent.time}</li>
        <li><strong>Venue:</strong> ${tournamentEvent.venue}</li>
        <li><strong>Entry:</strong> ${tournamentEvent.entry}</li>
      </ul>

      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">Match pairings will be made before the tournament starts on the day.</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;">If you need to withdraw, please email <a href="mailto:${contactEmail}" style="color:#2563eb;font-weight:700;">${contactEmail}</a> as soon as possible.</p>
    </div>
  </body>
</html>`
}

export async function sendRegistrationConfirmationEmail(
  entry: TournamentEntryInput
): Promise<SendRegistrationConfirmationResult> {
  const config = getEmailConfig()

  if (!config) {
    console.warn(
      "Registration confirmation email skipped: missing ZEPTOMAIL_API_KEY, ZEPTOMAIL_FROM_EMAIL, or TOURNAMENT_CONTACT_EMAIL."
    )
    return { ok: false, reason: "Email is not configured." }
  }

  const url = "api.zeptomail.eu/"
  const client = new SendMailClient({ url, token: config.apiKey })

  try {
    await client.sendMail({
      from: {
        address: config.fromEmail,
        name: config.fromName,
      },
      to: [
        {
          email_address: {
            address: entry.parentEmail,
            name: entry.parentName,
          },
        },
      ],
      subject: `${tournamentEvent.name} registration confirmed – ${entry.playerName}`,
      textbody: buildPlainTextEmail(entry, config.contactEmail),
      htmlbody: buildHtmlEmail(entry, config.contactEmail),
    })

    return { ok: true }
  } catch (error) {
    console.error("Failed to send registration confirmation email:", error)
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
