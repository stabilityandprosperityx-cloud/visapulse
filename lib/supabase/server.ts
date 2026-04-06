import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VisaCase } from "@/lib/types";

export function createServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchAllCases(): Promise<VisaCase[]> {
  try {
    const supabase = createServerSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("visa_cases")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase fetch error:", error.message);
      return [];
    }
    return (data ?? []) as VisaCase[];
  } catch {
    return [];
  }
}

export async function fetchTotalCaseCount(): Promise<number> {
  try {
    const supabase = createServerSupabase();
    if (!supabase) return 0;
    const { count, error } = await supabase
      .from("visa_cases")
      .select("id", { count: "exact", head: true });
    if (error) {
      console.error("Supabase count error:", error.message);
      return 0;
    }
    return count ?? 0;
  } catch {
    return 0;
  }
}
