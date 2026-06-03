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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity: {
        Row: {
          action: string
          detail: string | null
          id: string
          ts: string
          user_name: string | null
        }
        Insert: {
          action: string
          detail?: string | null
          id?: string
          ts?: string
          user_name?: string | null
        }
        Update: {
          action?: string
          detail?: string | null
          id?: string
          ts?: string
          user_name?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          breaks: Json
          id: number
          num_cutters: number
          shift_end: string
          shift_start: string
          updated_at: string
        }
        Insert: {
          breaks?: Json
          id: number
          num_cutters?: number
          shift_end?: string
          shift_start?: string
          updated_at?: string
        }
        Update: {
          breaks?: Json
          id?: number
          num_cutters?: number
          shift_end?: string
          shift_start?: string
          updated_at?: string
        }
        Relationships: []
      }
      lays: {
        Row: {
          buyer: string | null
          color: string | null
          created_at: string
          cut_dur: number | null
          cut_no: string | null
          id: string
          lay_no: string | null
          marker_length: number | null
          plan_date: string
          plies: number | null
          priority: number | null
          ratio: string | null
          session: string | null
          spread_dur: number | null
          spread_start: string | null
          spreader: number | null
          style: string | null
          total_yards: number | null
        }
        Insert: {
          buyer?: string | null
          color?: string | null
          created_at?: string
          cut_dur?: number | null
          cut_no?: string | null
          id?: string
          lay_no?: string | null
          marker_length?: number | null
          plan_date: string
          plies?: number | null
          priority?: number | null
          ratio?: string | null
          session?: string | null
          spread_dur?: number | null
          spread_start?: string | null
          spreader?: number | null
          style?: string | null
          total_yards?: number | null
        }
        Update: {
          buyer?: string | null
          color?: string | null
          created_at?: string
          cut_dur?: number | null
          cut_no?: string | null
          id?: string
          lay_no?: string | null
          marker_length?: number | null
          plan_date?: string
          plies?: number | null
          priority?: number | null
          ratio?: string | null
          session?: string | null
          spread_dur?: number | null
          spread_start?: string | null
          spreader?: number | null
          style?: string | null
          total_yards?: number | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          id: string
          idle_windows: Json | null
          input_lays: Json | null
          name: string
          plan_date: string
          result: Json | null
          settings: Json | null
          summary: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          idle_windows?: Json | null
          input_lays?: Json | null
          name: string
          plan_date: string
          result?: Json | null
          settings?: Json | null
          summary?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          idle_windows?: Json | null
          input_lays?: Json | null
          name?: string
          plan_date?: string
          result?: Json | null
          settings?: Json | null
          summary?: Json | null
        }
        Relationships: []
      }
      styles: {
        Row: {
          buyer: string | null
          code: string
          created_at: string
          default_cut_dur: number | null
          description: string | null
          id: string
        }
        Insert: {
          buyer?: string | null
          code: string
          created_at?: string
          default_cut_dur?: number | null
          description?: string | null
          id?: string
        }
        Update: {
          buyer?: string | null
          code?: string
          created_at?: string
          default_cut_dur?: number | null
          description?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
