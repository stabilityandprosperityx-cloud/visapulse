import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  generateSyntheticCaseRows,
  randomCronBatchSize,
} from "@/lib/cron-synthetic-cases";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return unauthorized();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Server missing Supabase configuration" },
      { status: 503 }
    );
  }

  const n = randomCronBatchSize();
  const rows = generateSyntheticCaseRows(n);

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("visa_cases").insert(rows);

  if (error) {
    console.error("Cron add-cases insert failed:", error.message);
    return NextResponse.json(
      { error: "Insert failed", detail: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ added: n });
}
