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
          notes?: string | null
          created_at?: string
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
