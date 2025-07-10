export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          admin_level: string;
          created_at: string;
          created_by: string | null;
          id: string;
          is_active: boolean;
          user_id: string;
        };
        Insert: {
          admin_level?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_active?: boolean;
          user_id: string;
        };
        Update: {
          admin_level?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_active?: boolean;
          user_id?: string;
        };
        Relationships: [];
      };
      driver_profiles: {
        Row: {
          avatar_url: string | null;
          background_check_status: string | null;
          created_at: string | null;
          documents_uploaded: boolean | null;
          email: string | null;
          full_name: string | null;
          id: string;
          is_online: boolean | null;
          is_verified: boolean | null;
          license_number: string | null;
          phone_number: string | null;
          phone_verified: boolean | null;
          updated_at: string | null;
          vehicle_make: string | null;
          vehicle_model: string | null;
          vehicle_plate: string | null;
          vehicle_year: number | null;
          verification_approved_at: string | null;
          verification_notes: string | null;
          verification_status: string | null;
          verification_submitted_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          background_check_status?: string | null;
          created_at?: string | null;
          documents_uploaded?: boolean | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_online?: boolean | null;
          is_verified?: boolean | null;
          license_number?: string | null;
          phone_number?: string | null;
          phone_verified?: boolean | null;
          updated_at?: string | null;
          vehicle_make?: string | null;
          vehicle_model?: string | null;
          vehicle_plate?: string | null;
          vehicle_year?: number | null;
          verification_approved_at?: string | null;
          verification_notes?: string | null;
          verification_status?: string | null;
          verification_submitted_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          background_check_status?: string | null;
          created_at?: string | null;
          documents_uploaded?: boolean | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_online?: boolean | null;
          is_verified?: boolean | null;
          license_number?: string | null;
          phone_number?: string | null;
          phone_verified?: boolean | null;
          updated_at?: string | null;
          vehicle_make?: string | null;
          vehicle_model?: string | null;
          vehicle_plate?: string | null;
          vehicle_year?: number | null;
          verification_approved_at?: string | null;
          verification_notes?: string | null;
          verification_status?: string | null;
          verification_submitted_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          phone_number: string | null;
          phone_verified: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone_number?: string | null;
          phone_verified?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone_number?: string | null;
          phone_verified?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      ride_companies: {
        Row: {
          company_name: string;
          contact_email: string;
          contact_phone: string | null;
          created_at: string;
          description: string | null;
          id: string;
          logo_url: string | null;
          status: string | null;
          updated_at: string;
          verified_at: string | null;
          verified_by: string | null;
          website_url: string | null;
        };
        Insert: {
          company_name: string;
          contact_email: string;
          contact_phone?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          status?: string | null;
          updated_at?: string;
          verified_at?: string | null;
          verified_by?: string | null;
          website_url?: string | null;
        };
        Update: {
          company_name?: string;
          contact_email?: string;
          contact_phone?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          logo_url?: string | null;
          status?: string | null;
          updated_at?: string;
          verified_at?: string | null;
          verified_by?: string | null;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ride_companies_verified_by_fkey";
            columns: ["verified_by"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          }
        ];
      };
      ride_receipts: {
        Row: {
          amount: number;
          generated_at: string;
          id: string;
          payment_method: string | null;
          receipt_data: Json | null;
          receipt_number: string;
          ride_id: string;
          tax_amount: number | null;
          total_amount: number;
          user_id: string;
        };
        Insert: {
          amount: number;
          generated_at?: string;
          id?: string;
          payment_method?: string | null;
          receipt_data?: Json | null;
          receipt_number: string;
          ride_id: string;
          tax_amount?: number | null;
          total_amount: number;
          user_id: string;
        };
        Update: {
          amount?: number;
          generated_at?: string;
          id?: string;
          payment_method?: string | null;
          receipt_data?: Json | null;
          receipt_number?: string;
          ride_id?: string;
          tax_amount?: number | null;
          total_amount?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ride_receipts_ride_id_fkey";
            columns: ["ride_id"];
            isOneToOne: false;
            referencedRelation: "rides";
            referencedColumns: ["id"];
          }
        ];
      };
      ride_requests: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          id: string;
          processed_at: string | null;
          processed_by: string | null;
          request_type: string;
          requested_by: string;
          ride_id: string;
          status: string;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          id?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          request_type: string;
          requested_by: string;
          ride_id: string;
          status?: string;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          id?: string;
          processed_at?: string | null;
          processed_by?: string | null;
          request_type?: string;
          requested_by?: string;
          ride_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ride_requests_processed_by_fkey";
            columns: ["processed_by"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ride_requests_ride_id_fkey";
            columns: ["ride_id"];
            isOneToOne: false;
            referencedRelation: "rides";
            referencedColumns: ["id"];
          }
        ];
      };
      rides: {
        Row: {
          booking_type: string;
          company_id: string | null;
          created_at: string;
          departure_date: string;
          departure_time: string;
          driver_id: string | null;
          from_location: string;
          id: string;
          pickup_location: string | null;
          price: number | null;
          seats_requested: number;
          status: string;
          to_location: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          booking_type: string;
          company_id?: string | null;
          created_at?: string;
          departure_date: string;
          departure_time: string;
          driver_id?: string | null;
          from_location: string;
          id?: string;
          pickup_location?: string | null;
          price?: number | null;
          seats_requested?: number;
          status?: string;
          to_location: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          booking_type?: string;
          company_id?: string | null;
          created_at?: string;
          departure_date?: string;
          departure_time?: string;
          driver_id?: string | null;
          from_location?: string;
          id?: string;
          pickup_location?: string | null;
          price?: number | null;
          seats_requested?: number;
          status?: string;
          to_location?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rides_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "ride_companies";
            referencedColumns: ["id"];
          }
        ];
      };
      pricing: {
        Row: {
          id: string;
          from_type: string;
          from_location: string;
          to_type: string;
          to_location: string;
          vehicle_type: string;
          price_per_seat: number;
          is_active: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          from_type: string;
          from_location: string;
          to_type: string;
          to_location: string;
          vehicle_type: string;
          price_per_seat: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_type?: string;
          from_location?: string;
          to_type?: string;
          to_location?: string;
          vehicle_type?: string;
          price_per_seat?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_receipt_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
