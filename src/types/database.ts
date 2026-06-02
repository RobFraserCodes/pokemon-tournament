export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      tournament_entries: {
        Row: {
          id: string
          player_name: string
          player_age: number
          parent_name: string
          parent_email: string
          parent_phone: string | null
          experience_level: "New Player" | "Casual Player" | "Tournament Player"
          has_own_deck: boolean
          favourite_pokemon_type: string
          show_on_leaderboard: boolean
          leaderboard_nickname: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          player_name: string
          player_age: number
          parent_name: string
          parent_email: string
          parent_phone?: string | null
          experience_level: "New Player" | "Casual Player" | "Tournament Player"
          has_own_deck?: boolean
          favourite_pokemon_type: string
          show_on_leaderboard?: boolean
          leaderboard_nickname?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          player_name?: string
          player_age?: number
          parent_name?: string
          parent_email?: string
          parent_phone?: string | null
          experience_level?: "New Player" | "Casual Player" | "Tournament Player"
          has_own_deck?: boolean
          favourite_pokemon_type?: string
          show_on_leaderboard?: boolean
          leaderboard_nickname?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      tournament_matches: {
        Row: {
          id: string
          round_number: number
          entry_id_a: string
          entry_id_b: string | null
          winner_entry_id: string | null
          is_draw: boolean
          status: "pending" | "completed"
          created_at: string
        }
        Insert: {
          id?: string
          round_number: number
          entry_id_a: string
          entry_id_b?: string | null
          winner_entry_id?: string | null
          is_draw?: boolean
          status?: "pending" | "completed"
          created_at?: string
        }
        Update: {
          id?: string
          round_number?: number
          entry_id_a?: string
          entry_id_b?: string | null
          winner_entry_id?: string | null
          is_draw?: boolean
          status?: "pending" | "completed"
          created_at?: string
        }
        Relationships: []
      }
      tournament_state: {
        Row: {
          id: string
          status: "registration" | "in_progress" | "completed"
          current_round: number
          updated_at: string
        }
        Insert: {
          id?: string
          status?: "registration" | "in_progress" | "completed"
          current_round?: number
          updated_at?: string
        }
        Update: {
          id?: string
          status?: "registration" | "in_progress" | "completed"
          current_round?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type TournamentEntry =
  Database["public"]["Tables"]["tournament_entries"]["Row"]
