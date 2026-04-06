import {
  COUNTRIES,
  INCOME_RANGES,
  PROCESSING_TIMES,
  VISA_TYPES,
  type ResultValue,
} from "@/lib/constants";

const RESULTS: ResultValue[] = ["approved", "rejected", "pending"];

export type SubmitPayload = {
  country: string;
  visa_type: string;
  income_range: string;
  result: ResultValue;
  processing_time: string;
  note: string | null;
};

export function validateSubmitBody(body: unknown):
  | { ok: true; data: SubmitPayload }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const o = body as Record<string, unknown>;

  const country = typeof o.country === "string" ? o.country.trim() : "";
  const visa_type = typeof o.visa_type === "string" ? o.visa_type.trim() : "";
  const visa_type_other =
    typeof o.visa_type_other === "string" ? o.visa_type_other.trim() : "";
  const income_range =
    typeof o.income_range === "string" ? o.income_range.trim() : "";
  const result = typeof o.result === "string" ? o.result.trim() : "";
  const processing_time =
    typeof o.processing_time === "string" ? o.processing_time.trim() : "";
  const noteRaw = o.note;

  if (!COUNTRIES.includes(country as (typeof COUNTRIES)[number])) {
    return { ok: false, error: "Invalid country" };
  }
  if (!VISA_TYPES.includes(visa_type as (typeof VISA_TYPES)[number])) {
    return { ok: false, error: "Invalid visa type" };
  }
  if (!INCOME_RANGES.includes(income_range as (typeof INCOME_RANGES)[number])) {
    return { ok: false, error: "Invalid income range" };
  }
  if (!RESULTS.includes(result as ResultValue)) {
    return { ok: false, error: "Invalid result" };
  }
  if (
    !PROCESSING_TIMES.includes(
      processing_time as (typeof PROCESSING_TIMES)[number]
    )
  ) {
    return { ok: false, error: "Invalid processing time" };
  }

  let normalizedVisaType = visa_type;
  if (visa_type === "Other") {
    if (!visa_type_other) {
      return { ok: false, error: "Please specify your visa type" };
    }
    if (visa_type_other.length > 50) {
      return { ok: false, error: "Visa type must be 50 characters or less" };
    }
    normalizedVisaType = visa_type_other;
  }

  let note: string | null = null;
  if (noteRaw !== undefined && noteRaw !== null && noteRaw !== "") {
    if (typeof noteRaw !== "string") {
      return { ok: false, error: "Note must be text" };
    }
    const t = noteRaw.trim();
    if (t.length > 200) {
      return { ok: false, error: "Note must be 200 characters or less" };
    }
    note = t.length ? t : null;
  }

  return {
    ok: true,
    data: {
      country,
      visa_type: normalizedVisaType,
      income_range,
      result: result as ResultValue,
      processing_time,
      note,
    },
  };
}
