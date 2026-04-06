import type { VisaCase } from "@/lib/types";

const INCOME_ORDER = [
  "Under $1k",
  "$1k-$3k",
  "$3k-$5k",
  "$5k-$10k",
  "$10k+",
];

function incomeMidpoint(range: string): number | null {
  const idx = INCOME_ORDER.indexOf(range);
  if (idx === -1) return null;
  const mids = [500, 2000, 4000, 7500, 12000];
  return mids[idx] ?? null;
}

export function filterCases(
  cases: VisaCase[],
  country: string | null,
  visaType: string | null
): VisaCase[] {
  return cases.filter((c) => {
    if (country && c.country !== country) return false;
    if (visaType && c.visa_type !== visaType) return false;
    return true;
  });
}

export function approvalRate(cases: VisaCase[]): number | null {
  const decided = cases.filter(
    (c) => c.result === "approved" || c.result === "rejected"
  );
  if (decided.length === 0) return null;
  const approved = decided.filter((c) => c.result === "approved").length;
  return Math.round((approved / decided.length) * 1000) / 10;
}

export function averageIncomeApproved(cases: VisaCase[]): number | null {
  const approved = cases.filter((c) => c.result === "approved");
  const values = approved
    .map((c) => incomeMidpoint(c.income_range))
    .filter((n): n is number => n !== null);
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round(sum / values.length);
}

function countByVisa(cases: VisaCase[], result: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of cases) {
    if (c.result !== result) continue;
    m.set(c.visa_type, (m.get(c.visa_type) ?? 0) + 1);
  }
  return m;
}

export function topVisaByResult(
  cases: VisaCase[],
  result: "approved" | "rejected"
): string | null {
  const m = countByVisa(cases, result);
  let best: string | null = null;
  let bestN = 0;
  m.forEach((n, visa) => {
    if (n > bestN) {
      bestN = n;
      best = visa;
    }
  });
  return best;
}
