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
      event_registrations: {
        Row: {
          cancelled_at: string | null
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          facilitator_id: string
          id: string
          location: string
          max_participants: number
          price: number
          time: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          facilitator_id: string
          id?: string
          location: string
          max_participants?: number
          price?: number
          time: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          facilitator_id?: string
          id?: string
          location?: string
          max_participants?: number
          price?: number
          time?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilitator_applications: {
        Row: {
          admin_notes: string | null
          approach: string | null
          availability: string | null
          certifications: string | null
          contact_email: string | null
          contact_references: string | null
          experience_description: string
          id: string
          languages: string[] | null
          preferred_practice_types: string[] | null
          public_bio: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          title: string | null
          user_id: string
          website: string | null
          work_types: string[] | null
          years_experience: number | null
        }
        Insert: {
          admin_notes?: string | null
          approach?: string | null
          availability?: string | null
          certifications?: string | null
          contact_email?: string | null
          contact_references?: string | null
          experience_description: string
          id?: string
          languages?: string[] | null
          preferred_practice_types?: string[] | null
          public_bio?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          title?: string | null
          user_id: string
          website?: string | null
          work_types?: string[] | null
          years_experience?: number | null
        }
        Update: {
          admin_notes?: string | null
          approach?: string | null
          availability?: string | null
          certifications?: string | null
          contact_email?: string | null
          contact_references?: string | null
          experience_description?: string
          id?: string
          languages?: string[] | null
          preferred_practice_types?: string[] | null
          public_bio?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          title?: string | null
          user_id?: string
          website?: string | null
          work_types?: string[] | null
          years_experience?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approach: string | null
          bio: string | null
          contact_email: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_public_profile: boolean | null
          languages: string[] | null
          phone: string | null
          public_bio: string | null
          role: Database["public"]["Enums"]["user_role"]
          title: string | null
          updated_at: string
          user_id: string
          website: string | null
          work_types: string[] | null
          years_experience: number | null
        }
        Insert: {
          approach?: string | null
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_public_profile?: boolean | null
          languages?: string[] | null
          phone?: string | null
          public_bio?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          title?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          work_types?: string[] | null
          years_experience?: number | null
        }
        Update: {
          approach?: string | null
          bio?: string | null
          contact_email?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_public_profile?: boolean | null
          languages?: string[] | null
          phone?: string | null
          public_bio?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          title?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          work_types?: string[] | null
          years_experience?: number | null
        }
        Relationships: []
      }
      resource_submissions: {
        Row: {
          admin_notes: string | null
          category: string
          content: string | null
          created_at: string
          description: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          tags: string[]
          title: string
          type: string
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          category: string
          content?: string | null
          created_at?: string
          description: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          tags?: string[]
          title: string
          type: string
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          category?: string
          content?: string | null
          created_at?: string
          description?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          tags?: string[]
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      resources: {
        Row: {
          author_id: string
          author_name: string
          category: string
          content: string | null
          created_at: string
          description: string
          id: string
          publish_date: string
          tags: string[]
          title: string
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          author_id: string
          author_name: string
          category: string
          content?: string | null
          created_at?: string
          description: string
          id?: string
          publish_date?: string
          tags?: string[]
          title: string
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          author_id?: string
          author_name?: string
          category?: string
          content?: string | null
          created_at?: string
          description?: string
          id?: string
          publish_date?: string
          tags?: string[]
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      venue_submissions: {
        Row: {
          admin_notes: string | null
          contact_information: string
          cost_level: string
          created_at: string
          hosting_capacity: number
          id: string
          location: string
          name: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          contact_information: string
          cost_level: string
          created_at?: string
          hosting_capacity: number
          id?: string
          location: string
          name: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          contact_information?: string
          cost_level?: string
          created_at?: string
          hosting_capacity?: number
          id?: string
          location?: string
          name?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          author_id: string
          contact_information: string
          cost_level: string
          created_at: string
          hosting_capacity: number
          id: string
          location: string
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          contact_information: string
          cost_level: string
          created_at?: string
          hosting_capacity: number
          id?: string
          location: string
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          contact_information?: string
          cost_level?: string
          created_at?: string
          hosting_capacity?: number
          id?: string
          location?: string
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status: "pending" | "approved" | "rejected"
      user_role: "user" | "facilitator" | "admin"
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
    Enums: {
      application_status: ["pending", "approved", "rejected"],
      user_role: ["user", "facilitator", "admin"],
    },
  },
} as const
