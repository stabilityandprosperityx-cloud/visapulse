import { unstable_noStore as noStore } from "next/cache";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VisaCase } from "@/lib/types";

export function createServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });
}

export async function fetchAllCases(): Promise<VisaCase[]> {
  noStore();
  try {
    const supabase = createServerSupabase();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("visa_cases")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10_000);
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
  noStore();
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

/** One page of cases for current filters, newest first (not limited by global fetch cap). */
export async function fetchFilteredCasesPage(
  country: string | null,
  visaType: string | null,
  page: number,
  perPage: number
): Promise<VisaCase[]> {
  noStore();
  try {
    const supabase = createServerSupabase();
    if (!supabase) return [];
    const safePage = Math.max(1, page);
    const from = (safePage - 1) * perPage;
    const to = from + perPage - 1;
    let q = supabase.from("visa_cases").select("*");
    if (country) q = q.eq("country", country);
    if (visaType) q = q.eq("visa_type", visaType);
    const { data, error } = await q
      .order("created_at", { ascending: false })
      .range(from, to);
    if (error) {
      console.error("Supabase paged fetch error:", error.message);
      return [];
    }
    return (data ?? []) as VisaCase[];
  } catch {
    return [];
  }
}

/** Exact row count for current filters (matches filterCases). */
export async function fetchFilteredCaseCount(
  country: string | null,
  visaType: string | null
): Promise<number> {
  noStore();
  try {
    const supabase = createServerSupabase();
    if (!supabase) return 0;
    let q = supabase
      .from("visa_cases")
      .select("id", { count: "exact", head: true });
    if (country) q = q.eq("country", country);
    if (visaType) q = q.eq("visa_type", visaType);
    const { count, error } = await q;
    if (error) {
      console.error("Supabase filtered count error:", error.message);
      return 0;
    }
    return count ?? 0;
  } catch {
    return 0;
  }
}
