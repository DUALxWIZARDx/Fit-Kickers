import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://iyhhigxywqkkphbpxkma.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aGhpZ3h5d3Fra3BoYnB4a21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzU3NDMsImV4cCI6MjA2MDg1MTc0M30.7g6C_W7_i3T238vT7wR0Y4a6-zT2xY0K4pX6nL5R-k4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  selected_batch?: string;
  membership_duration?: string;
  membership_status: "active" | "inactive" | "pending";
  belt_rank?: string;
  attendance_count?: number;
  total_classes?: number;
  progress_percentage?: number;
  created_at?: string;
}
