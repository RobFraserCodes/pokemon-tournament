export type TournamentMatchRow = {
  id: string
  round_number: number
  entry_id_a: string
  entry_id_b: string | null
  winner_entry_id: string | null
  is_draw: boolean
  status: "pending" | "completed"
  created_at: string
}

export type TournamentEntryRow = {
  id: string
  player_name: string
  player_age: number
  parent_name: string
  parent_email: string
  parent_phone: string | null
  experience_level: "New Player" | "Casual Player" | "Tournament Player"
  favourite_pokemon_type: string
  has_own_deck: boolean
  show_on_leaderboard: boolean
  leaderboard_nickname: string | null
  notes: string | null
  created_at: string
}

export type TournamentStateRow = {
  id: string
  status: "registration" | "in_progress" | "completed"
  current_round: number
  updated_at: string
}

export type StandingRow = {
  entryId: string
  playerName: string
  nickname: string | null
  showOnLeaderboard: boolean
  experienceLevel: TournamentEntryRow["experience_level"]
  favouritePokemonType: string
  wins: number
  losses: number
  draws: number
  byes: number
  points: number
  played: number
}

export type LeaderboardRow = {
  id: string
  player_name: string
  experience_level: TournamentEntryRow["experience_level"]
  favourite_pokemon_type: string
  wins: number
  losses: number
  draws: number
  points: number
  played: number
}

export function calculateStandings(
  entries: TournamentEntryRow[],
  matches: TournamentMatchRow[]
): StandingRow[] {
  const completedMatches = matches.filter((match) => match.status === "completed")
  const stats = new Map<
    string,
    Omit<StandingRow, "entryId" | "playerName" | "nickname" | "showOnLeaderboard" | "experienceLevel" | "favouritePokemonType">
  >()

  for (const entry of entries) {
    stats.set(entry.id, {
      wins: 0,
      losses: 0,
      draws: 0,
      byes: 0,
      points: 0,
      played: 0,
    })
  }

  for (const match of completedMatches) {
    const playerA = stats.get(match.entry_id_a)
    if (!playerA) {
      continue
    }

    if (!match.entry_id_b) {
      playerA.byes += 1
      playerA.wins += 1
      playerA.points += 3
      continue
    }

    const playerB = stats.get(match.entry_id_b)
    if (!playerB) {
      continue
    }

    playerA.played += 1
    playerB.played += 1

    if (match.is_draw) {
      playerA.draws += 1
      playerB.draws += 1
      playerA.points += 1
      playerB.points += 1
      continue
    }

    if (match.winner_entry_id === match.entry_id_a) {
      playerA.wins += 1
      playerB.losses += 1
      playerA.points += 3
      continue
    }

    if (match.winner_entry_id === match.entry_id_b) {
      playerB.wins += 1
      playerA.losses += 1
      playerB.points += 3
    }
  }

  return entries
    .map((entry) => {
      const record = stats.get(entry.id) ?? {
        wins: 0,
        losses: 0,
        draws: 0,
        byes: 0,
        points: 0,
        played: 0,
      }

      return {
        entryId: entry.id,
        playerName: entry.player_name,
        nickname: entry.leaderboard_nickname,
        showOnLeaderboard: entry.show_on_leaderboard,
        experienceLevel: entry.experience_level,
        favouritePokemonType: entry.favourite_pokemon_type,
        ...record,
      }
    })
    .sort((left, right) => {
      if (right.points !== left.points) {
        return right.points - left.points
      }

      if (right.wins !== left.wins) {
        return right.wins - left.wins
      }

      return left.playerName.localeCompare(right.playerName)
    })
}

export function toPublicLeaderboard(standings: StandingRow[]): LeaderboardRow[] {
  return standings
    .filter(
      (standing) =>
        standing.showOnLeaderboard &&
        standing.nickname &&
        standing.nickname.trim().length >= 2
    )
    .map((standing) => ({
      id: standing.entryId,
      player_name: standing.nickname!,
      experience_level: standing.experienceLevel,
      favourite_pokemon_type: standing.favouritePokemonType,
      wins: standing.wins,
      losses: standing.losses,
      draws: standing.draws,
      points: standing.points,
      played: standing.played,
    }))
}

export function havePlayedBefore(
  matches: TournamentMatchRow[],
  entryA: string,
  entryB: string
) {
  return matches.some(
    (match) =>
      (match.entry_id_a === entryA && match.entry_id_b === entryB) ||
      (match.entry_id_a === entryB && match.entry_id_b === entryA)
  )
}

const EXPERIENCE_LEVEL_ORDER = [
  "New Player",
  "Casual Player",
  "Tournament Player",
] as const satisfies readonly TournamentEntryRow["experience_level"][]

type PairingInsert = {
  round_number: number
  entry_id_a: string
  entry_id_b: string | null
  winner_entry_id: string | null
  is_draw: boolean
  status: "pending" | "completed"
}

function experienceRank(level: TournamentEntryRow["experience_level"]) {
  return EXPERIENCE_LEVEL_ORDER.indexOf(level)
}

function experienceDistance(
  left: TournamentEntryRow["experience_level"],
  right: TournamentEntryRow["experience_level"]
) {
  return Math.abs(experienceRank(left) - experienceRank(right))
}

function shuffleArray<T>(items: T[]) {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  return copy
}

function selectByeRecipient(candidates: StandingRow[]) {
  return [...candidates].sort((left, right) => {
    if (left.byes !== right.byes) {
      return left.byes - right.byes
    }

    if (left.points !== right.points) {
      return left.points - right.points
    }

    return left.playerName.localeCompare(right.playerName)
  })[0]
}

function createPendingPairing(
  roundNumber: number,
  playerA: StandingRow,
  playerB: StandingRow
): PairingInsert {
  return {
    round_number: roundNumber,
    entry_id_a: playerA.entryId,
    entry_id_b: playerB.entryId,
    winner_entry_id: null,
    is_draw: false,
    status: "pending",
  }
}

function createByePairing(
  roundNumber: number,
  player: StandingRow
): PairingInsert {
  return {
    round_number: roundNumber,
    entry_id_a: player.entryId,
    entry_id_b: null,
    winner_entry_id: player.entryId,
    is_draw: false,
    status: "completed",
  }
}

function buildRound1Pairings(
  standings: StandingRow[],
  roundNumber: number
): PairingInsert[] {
  const groups = new Map<
    TournamentEntryRow["experience_level"],
    StandingRow[]
  >()

  for (const level of EXPERIENCE_LEVEL_ORDER) {
    groups.set(level, [])
  }

  for (const standing of standings) {
    groups.get(standing.experienceLevel)?.push(standing)
  }

  for (const level of EXPERIENCE_LEVEL_ORDER) {
    groups.set(level, shuffleArray(groups.get(level) ?? []))
  }

  const pairings: PairingInsert[] = []
  let unpaired: StandingRow[] = []

  for (const level of EXPERIENCE_LEVEL_ORDER) {
    const group = [...(groups.get(level) ?? [])]

    while (group.length >= 2) {
      const playerA = group.pop()!
      const playerB = group.pop()!
      pairings.push(createPendingPairing(roundNumber, playerA, playerB))
    }

    if (group.length === 1) {
      unpaired.push(group.pop()!)
    }
  }

  while (unpaired.length >= 2) {
    unpaired.sort(
      (left, right) =>
        experienceRank(left.experienceLevel) -
        experienceRank(right.experienceLevel)
    )

    const playerA = unpaired.shift()!
    let bestIndex = 0
    let bestDistance = Infinity

    for (let index = 0; index < unpaired.length; index += 1) {
      const distance = experienceDistance(
        playerA.experienceLevel,
        unpaired[index].experienceLevel
      )

      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    }

    const playerB = unpaired.splice(bestIndex, 1)[0]
    pairings.push(createPendingPairing(roundNumber, playerA, playerB))
  }

  if (unpaired.length === 1) {
    pairings.push(
      createByePairing(roundNumber, selectByeRecipient(unpaired))
    )
  }

  return pairings
}

function buildSwissPairings(
  standings: StandingRow[],
  matches: TournamentMatchRow[],
  roundNumber: number
): PairingInsert[] {
  const orderedEntries = [...standings]
  const pairings: PairingInsert[] = []
  const used = new Set<string>()
  const byeRecipient =
    orderedEntries.length % 2 === 1
      ? selectByeRecipient(orderedEntries)
      : null

  for (let index = 0; index < orderedEntries.length; index += 1) {
    const current = orderedEntries[index]

    if (used.has(current.entryId)) {
      continue
    }

    if (byeRecipient?.entryId === current.entryId) {
      continue
    }

    let opponentIndex = index + 1
    let foundOpponent = false

    while (opponentIndex < orderedEntries.length) {
      const candidate = orderedEntries[opponentIndex]

      if (
        used.has(candidate.entryId) ||
        candidate.entryId === byeRecipient?.entryId ||
        havePlayedBefore(matches, current.entryId, candidate.entryId)
      ) {
        opponentIndex += 1
        continue
      }

      foundOpponent = true
      break
    }

    if (!foundOpponent) {
      opponentIndex = index + 1

      while (opponentIndex < orderedEntries.length) {
        const candidate = orderedEntries[opponentIndex]

        if (
          used.has(candidate.entryId) ||
          candidate.entryId === byeRecipient?.entryId
        ) {
          opponentIndex += 1
          continue
        }

        foundOpponent = true
        break
      }
    }

    if (!foundOpponent || opponentIndex >= orderedEntries.length) {
      continue
    }

    const opponent = orderedEntries[opponentIndex]
    pairings.push(createPendingPairing(roundNumber, current, opponent))
    used.add(current.entryId)
    used.add(opponent.entryId)
  }

  if (byeRecipient) {
    pairings.push(createByePairing(roundNumber, byeRecipient))
  }

  return pairings
}

export function buildNextRoundPairings(
  entries: TournamentEntryRow[],
  matches: TournamentMatchRow[],
  roundNumber: number
) {
  if (entries.length < 2) {
    throw new Error("At least two registrations are required to create a draw.")
  }

  const standings = calculateStandings(entries, matches)

  if (roundNumber === 1) {
    return buildRound1Pairings(standings, roundNumber)
  }

  return buildSwissPairings(standings, matches, roundNumber)
}
