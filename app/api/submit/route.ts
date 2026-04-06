import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { hashIp, clientIpFromHeaders } from "@/lib/ip-hash";
import { validateSubmitBody } from "@/lib/validation";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const COOKIE_NAME = "visapulse_contributor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request: Request) {
  const supabase = createServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server is not configured for submissions" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validated = validateSubmitBody(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const ip = clientIpFromHeaders(request.headers);
  const ipHash = hashIp(ip);
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error: countError } = await supabase
    .from("visa_cases")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (countError) {
    console.error("Rate limit check failed:", countError.message);
    return NextResponse.json({ error: "Could not verify rate limit" }, { status: 500 });
  }

  if ((count ?? 0) >= MAX_PER_WINDOW) {
    return NextResponse.json(
      { error: "Too many submissions from this network. Try again later." },
      { status: 429 }
    );
  }

  const row = {
    country: validated.data.country,
    visa_type: validated.data.visa_type,
    income_range: validated.data.income_range,
    result: validated.data.result,
    processing_time: validated.data.processing_time,
    note: validated.data.note,
    ip_hash: ipHash,
  };

  const { error: insertError } = await supabase.from("visa_cases").insert(row);

  if (insertError) {
    console.error("Insert failed:", insertError.message);
    return NextResponse.json({ error: "Could not save submission" }, { status: 500 });
  }

  revalidatePath("/", "page");
  revalidatePath("/", "layout");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "1", {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
