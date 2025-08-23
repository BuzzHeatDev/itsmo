export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      holidays: {
        Row: {
          close_time_override: string | null
          created_at: string | null
          date: string
          id: string
          is_closed_all_day: boolean
          market_id: string
          name: string
          open_time_override: string | null
          updated_at: string | null
        }
        Insert: {
          close_time_override?: string | null
          created_at?: string | null
          date: string
          id?: string
          is_closed_all_day?: boolean
          market_id: string
          name: string
          open_time_override?: string | null
          updated_at?: string | null
        }
        Update: {
          close_time_override?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_closed_all_day?: boolean
          market_id?: string
          name?: string
          open_time_override?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holidays_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "market_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holidays_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          city: string
          country: string
          created_at: string | null
          flag_emoji: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          position: number
          short_name: string
          slug: string
          tier: number
          timezone: string
          updated_at: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          flag_emoji: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          position?: number
          short_name: string
          slug: string
          tier?: number
          timezone: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          flag_emoji?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          position?: number
          short_name?: string
          slug?: string
          tier?: number
          timezone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          close_time: string
          created_at: string | null
          has_lunch_break: boolean
          id: string
          lunch_close_time: string | null
          lunch_open_time: string | null
          market_id: string
          open_time: string
          updated_at: string | null
          weekday: number
        }
        Insert: {
          close_time: string
          created_at?: string | null
          has_lunch_break?: boolean
          id?: string
          lunch_close_time?: string | null
          lunch_open_time?: string | null
          market_id: string
          open_time: string
          updated_at?: string | null
          weekday: number
        }
        Update: {
          close_time?: string
          created_at?: string | null
          has_lunch_break?: boolean
          id?: string
          lunch_close_time?: string | null
          lunch_open_time?: string | null
          market_id?: string
          open_time?: string
          updated_at?: string | null
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "sessions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "market_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          adsense_client_id: string | null
          buymeacoffee_url: string | null
          contact_forward_email: string | null
          created_at: string | null
          default_timezone: string
          id: number
          show_openai_quips: boolean
          site_name: string
          updated_at: string | null
        }
        Insert: {
          adsense_client_id?: string | null
          buymeacoffee_url?: string | null
          contact_forward_email?: string | null
          created_at?: string | null
          default_timezone?: string
          id?: number
          show_openai_quips?: boolean
          site_name?: string
          updated_at?: string | null
        }
        Update: {
          adsense_client_id?: string | null
          buymeacoffee_url?: string | null
          contact_forward_email?: string | null
          created_at?: string | null
          default_timezone?: string
          id?: number
          show_openai_quips?: boolean
          site_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      market_overview: {
        Row: {
          city: string | null
          country: string | null
          flag_emoji: string | null
          holiday_count: number | null
          id: string | null
          is_active: boolean | null
          name: string | null
          position: number | null
          session_count: number | null
          short_name: string | null
          slug: string | null
          tier: number | null
          timezone: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
