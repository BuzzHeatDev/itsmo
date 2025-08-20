// Database types generated from Supabase schema
// These should be kept in sync with the actual database schema

export interface Database {
  public: {
    Tables: {
      markets: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_name: string;
          country: string;
          flag_emoji: string;
          city: string;
          timezone: string;
          tier: number;
          position: number;
          is_active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          short_name: string;
          country: string;
          flag_emoji: string;
          city: string;
          timezone: string;
          tier?: number;
          position?: number;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          short_name?: string;
          country?: string;
          flag_emoji?: string;
          city?: string;
          timezone?: string;
          tier?: number;
          position?: number;
          is_active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          market_id: string;
          weekday: number;
          open_time: string;
          close_time: string;
          has_lunch_break: boolean;
          lunch_open_time: string | null;
          lunch_close_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          market_id: string;
          weekday: number;
          open_time: string;
          close_time: string;
          has_lunch_break?: boolean;
          lunch_open_time?: string | null;
          lunch_close_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          market_id?: string;
          weekday?: number;
          open_time?: string;
          close_time?: string;
          has_lunch_break?: boolean;
          lunch_open_time?: string | null;
          lunch_close_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      holidays: {
        Row: {
          id: string;
          market_id: string;
          date: string;
          name: string;
          is_closed_all_day: boolean;
          open_time_override: string | null;
          close_time_override: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          market_id: string;
          date: string;
          name: string;
          is_closed_all_day?: boolean;
          open_time_override?: string | null;
          close_time_override?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          market_id?: string;
          date?: string;
          name?: string;
          is_closed_all_day?: boolean;
          open_time_override?: string | null;
          close_time_override?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: number;
          adsense_client_id: string | null;
          buymeacoffee_url: string | null;
          contact_forward_email: string | null;
          show_openai_quips: boolean;
          site_name: string;
          default_timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          adsense_client_id?: string | null;
          buymeacoffee_url?: string | null;
          contact_forward_email?: string | null;
          show_openai_quips?: boolean;
          site_name?: string;
          default_timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          adsense_client_id?: string | null;
          buymeacoffee_url?: string | null;
          contact_forward_email?: string | null;
          show_openai_quips?: boolean;
          site_name?: string;
          default_timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      market_overview: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_name: string;
          country: string;
          flag_emoji: string;
          city: string;
          timezone: string;
          tier: number;
          position: number;
          is_active: boolean;
          session_count: number;
          holiday_count: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Market = Database['public']['Tables']['markets']['Row'];
export type MarketInsert = Database['public']['Tables']['markets']['Insert'];
export type MarketUpdate = Database['public']['Tables']['markets']['Update'];

export type Session = Database['public']['Tables']['sessions']['Row'];
export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
export type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

export type Holiday = Database['public']['Tables']['holidays']['Row'];
export type HolidayInsert = Database['public']['Tables']['holidays']['Insert'];
export type HolidayUpdate = Database['public']['Tables']['holidays']['Update'];

export type Settings = Database['public']['Tables']['settings']['Row'];
export type SettingsInsert = Database['public']['Tables']['settings']['Insert'];
export type SettingsUpdate = Database['public']['Tables']['settings']['Update'];

export type MarketOverview = Database['public']['Views']['market_overview']['Row'];

// Extended types with relations
export interface MarketWithSessions extends Market {
  sessions: Session[];
}

export interface MarketWithSessionsAndHolidays extends Market {
  sessions: Session[];
  holidays: Holiday[];
}

export interface MarketStatusData {
  market: Market;
  sessions: Session[];
  holidays: Holiday[];
}
