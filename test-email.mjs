import { config } from 'dotenv'
import { SendMailClient } from 'zeptomail'

// Load environment variables
config({ path: '.env.local' })

const apiKey = process.env.ZEPTOMAIL_API_KEY
const fromEmail = process.env.ZEPTOMAIL_FROM_EMAIL
const fromName = process.env.ZEPTOMAIL_FROM_NAME || 'Loch Ness Cup'

if (!apiKey || !fromEmail) {
  console.error('❌ Missing ZEPTOMAIL_API_KEY or ZEPTOMAIL_FROM_EMAIL in .env.local')
  process.exit(1)
}

const url = "api.zeptomail.eu/"
const client = new SendMailClient({ url, token: apiKey })

// Test entry data
const testEntry = {
  playerName: "Test Player",
  playerAge: 10,
  parentName: "Rob Fraser",
  parentEmail: "rob.fraser.daviot@gmail.com",
  parentPhone: "+44 1234 567890",
  experienceLevel: "beginner",
  hasOwnDeck: false,
  notes: "This is a test registration email from ZeptoMail integration"
}

const tournamentEvent = {
  name: "Loch Ness Cup",
  date: "Saturday 4th July 2026",
  time: "10:00 AM - 12:30 PM",
  venue: "Glenurquhart Library",
  entry: "FREE"
}

const contactEmail = process.env.TOURNAMENT_CONTACT_EMAIL || "hi@robfraser.dev"

function formatOptional(value) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : "None provided"
}

const plainText = [
  `Hi ${testEntry.parentName},`,
  "",
  `Thanks for registering ${testEntry.playerName} for the ${tournamentEvent.name}.`,
  "",
  "Registration details",
  "--------------------",
  `Player name: ${testEntry.playerName}`,
  `Player age: ${testEntry.playerAge}`,
  `Experience level: ${testEntry.experienceLevel}`,
  `Own 60-card deck: ${testEntry.hasOwnDeck ? "Yes" : "No"}`,
  `Parent / guardian: ${testEntry.parentName}`,
  `Parent email: ${testEntry.parentEmail}`,
  `Parent phone: ${formatOptional(testEntry.parentPhone)}`,
  `Additional notes: ${formatOptional(testEntry.notes)}`,
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

const rows = [
  ["Player name", testEntry.playerName],
  ["Player age", String(testEntry.playerAge)],
  ["Experience level", testEntry.experienceLevel],
  ["Own 60-card deck", testEntry.hasOwnDeck ? "Yes" : "No"],
  ["Parent / guardian", testEntry.parentName],
  ["Parent email", testEntry.parentEmail],
  ["Parent phone", formatOptional(testEntry.parentPhone)],
  ["Additional notes", formatOptional(testEntry.notes)],
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

const htmlBody = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f5f3e8;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:3px solid #0f172a;border-radius:24px;padding:32px;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2563eb;">Registration confirmed</p>
      <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">${tournamentEvent.name}</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#334155;">Hi ${testEntry.parentName}, thanks for registering <strong>${testEntry.playerName}</strong>. Here is a summary of the details we received.</p>

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

      <div style="margin-top:24px;padding-top:24px;border-top:2px solid #e2e8f0;">
        <p style="margin:0;font-size:13px;color:#64748b;"><strong>Note:</strong> This is a test email from the ZeptoMail integration.</p>
      </div>
    </div>
  </body>
</html>`

async function sendTestEmail() {
  console.log('📧 Sending test email...')
  console.log(`From: ${fromName} <${fromEmail}>`)
  console.log(`To: ${testEntry.parentName} <${testEntry.parentEmail}>`)
  console.log('')

  try {
    const response = await client.sendMail({
      from: {
        address: fromEmail,
        name: fromName,
      },
      to: [
        {
          email_address: {
            address: testEntry.parentEmail,
            name: testEntry.parentName,
          },
        },
      ],
      subject: `${tournamentEvent.name} registration confirmed – ${testEntry.playerName} [TEST]`,
      textbody: plainText,
      htmlbody: htmlBody,
    })

    console.log('✅ Test email sent successfully!')
    console.log('Response:', JSON.stringify(response, null, 2))
  } catch (error) {
    console.error('❌ Failed to send test email:', error)
    process.exit(1)
  }
}

sendTestEmail()
