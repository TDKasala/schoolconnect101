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
      platform_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          code: string
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["school_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["school_status"]
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          approved: boolean
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          school_id: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_platform_admin: {
        Args: {
          admin_email: string
          admin_password: string
          admin_first_name: string
          admin_last_name: string
        }
        Returns: Json
      }
      setup_school: {
        Args: {
          school_name: string
          school_code: string
          school_address?: string
          admin_email: string
          admin_password: string
          admin_first_name: string
          admin_last_name: string
        }
        Returns: Json
      }
    }
    Enums: {
      school_status: "active" | "inactive" | "pending"
      user_role: "platform_admin" | "school_admin" | "teacher" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
