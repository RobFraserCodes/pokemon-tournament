const projectRef = "jnjtmxmipfxytllvhkbe"
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const baseUrl = `https://${projectRef}.supabase.co/rest/v1`

const entries = [
  {
    player_name: "Emma Test",
    player_age: 9,
    parent_name: "Sarah Test",
    parent_email: "emma.test@example.com",
    experience_level: "New Player",
    favourite_pokemon_type: "Fire",
    has_own_deck: true,
    show_on_leaderboard: true,
    leaderboard_nickname: "FlameFox",
  },
  {
    player_name: "Noah Test",
    player_age: 11,
    parent_name: "James Test",
    parent_email: "noah.test@example.com",
    experience_level: "Casual Player",
    favourite_pokemon_type: "Water",
    has_own_deck: true,
    show_on_leaderboard: true,
    leaderboard_nickname: "SplashKid",
  },
  {
    player_name: "Mia Test",
    player_age: 8,
    parent_name: "Laura Test",
    parent_email: "mia.test@example.com",
    experience_level: "New Player",
    favourite_pokemon_type: "Grass",
    has_own_deck: false,
    show_on_leaderboard: true,
    leaderboard_nickname: "LeafSprout",
  },
  {
    player_name: "Leo Test",
    player_age: 12,
    parent_name: "Chris Test",
    parent_email: "leo.test@example.com",
    experience_level: "Tournament Player",
    favourite_pokemon_type: "Electric",
    has_own_deck: true,
    show_on_leaderboard: true,
    leaderboard_nickname: "SparkyJ",
  },
  {
    player_name: "Ava Test",
    player_age: 10,
    parent_name: "Helen Test",
    parent_email: "ava.test@example.com",
    experience_level: "Casual Player",
    favourite_pokemon_type: "Rock",
    has_own_deck: false,
    show_on_leaderboard: true,
    leaderboard_nickname: "RockRoller",
  },
  {
    player_name: "Finn Test",
    player_age: 13,
    parent_name: "Mark Test",
    parent_email: "finn.test@example.com",
    experience_level: "Tournament Player",
    favourite_pokemon_type: "Ghost",
    has_own_deck: true,
    show_on_leaderboard: true,
    leaderboard_nickname: "GhostWhisper",
  },
  {
    player_name: "Ivy Test",
    player_age: 7,
    parent_name: "Anna Test",
    parent_email: "ivy.test@example.com",
    experience_level: "New Player",
    favourite_pokemon_type: "Fairy",
    has_own_deck: false,
    show_on_leaderboard: true,
    leaderboard_nickname: "FairyDust",
  },
  {
    player_name: "Kai Test",
    player_age: 14,
    parent_name: "Paul Test",
    parent_email: "kai.test@example.com",
    experience_level: "Casual Player",
    favourite_pokemon_type: "Dragon",
    has_own_deck: true,
    show_on_leaderboard: true,
    leaderboard_nickname: "DragonRookie",
  },
  {
    player_name: "Zoe Test",
    player_age: 9,
    parent_name: "Kate Test",
    parent_email: "zoe.test@example.com",
    experience_level: "New Player",
    favourite_pokemon_type: "Ice",
    has_own_deck: false,
    show_on_leaderboard: false,
    leaderboard_nickname: null,
  },
  {
    player_name: "Max Test",
    player_age: 11,
    parent_name: "Tom Test",
    parent_email: "max.test@example.com",
    experience_level: "Casual Player",
    favourite_pokemon_type: "Bug",
    has_own_deck: true,
    show_on_leaderboard: false,
    leaderboard_nickname: null,
  },
]

async function main() {
  for (const entry of entries) {
    const response = await fetch(`${baseUrl}/tournament_entries`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(entry),
    })

    if (!response.ok) {
      console.error(
        "Failed:",
        entry.leaderboard_nickname || entry.player_name,
        response.status,
        await response.text()
      )
      continue
    }

    const data = await response.json()
    const row = Array.isArray(data) ? data[0] : data
    console.log(
      "Added:",
      row.player_name,
      row.show_on_leaderboard
        ? `as ${row.leaderboard_nickname}`
        : "(leaderboard hidden)"
    )
  }

  const boardResponse = await fetch(
    `${baseUrl}/tournament_leaderboard?select=player_name,favourite_pokemon_type&order=created_at.asc`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  )

  const boardData = await boardResponse.json()
  console.log(`\nLeaderboard (${boardData.length} players):`)
  boardData.forEach((row, index) => {
    console.log(`${index + 1}. ${row.player_name} (${row.favourite_pokemon_type})`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
