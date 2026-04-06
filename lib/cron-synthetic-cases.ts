import { randomBytes } from "crypto";
import { COUNTRIES } from "@/lib/constants";

const TOP_COUNTRIES = new Set([
  "Portugal",
  "Spain",
  "Germany",
  "United Arab Emirates",
  "Thailand",
  "Netherlands",
  "United Kingdom",
  "United States",
  "Canada",
  "Georgia",
  "Greece",
  "France",
]);

const OTHER_COUNTRIES = COUNTRIES.filter((c) => !TOP_COUNTRIES.has(c));

const COUNTRY_WEIGHTS: { name: string; weight: number }[] = [
  { name: "Portugal", weight: 15 },
  { name: "Spain", weight: 12 },
  { name: "Germany", weight: 10 },
  { name: "United Arab Emirates", weight: 8 },
  { name: "Thailand", weight: 8 },
  { name: "Netherlands", weight: 6 },
  { name: "United Kingdom", weight: 6 },
  { name: "United States", weight: 6 },
  { name: "Canada", weight: 5 },
  { name: "Georgia", weight: 4 },
  { name: "Greece", weight: 4 },
  { name: "France", weight: 4 },
  { name: "__OTHER__", weight: 12 },
];

const MAIN_VISAS: { visa: string; weight: number }[] = [
  { visa: "Digital Nomad", weight: 25 },
  { visa: "Work Permit", weight: 20 },
  { visa: "Golden Visa / Investor", weight: 15 },
  { visa: "Tourist", weight: 10 },
  { visa: "Student", weight: 10 },
  { visa: "Retirement / Passive Income (D7, etc.)", weight: 10 },
  { visa: "__OTHER__", weight: 10 },
];

const OTHER_VISAS = [
  "Skilled Worker (EU Blue Card, etc.)",
  "Freelancer Visa",
  "Family Reunification",
  "Startup / Entrepreneur Visa",
  "Long-term Residence",
  "Citizenship by Investment",
] as const;

const RESULT_WEIGHTS: { result: string; weight: number }[] = [
  { result: "approved", weight: 68 },
  { result: "rejected", weight: 18 },
  { result: "pending", weight: 14 },
];

const INCOME_WEIGHTS: { range: string; weight: number }[] = [
  { range: "Under $1k", weight: 8 },
  { range: "$1k-$3k", weight: 25 },
  { range: "$3k-$5k", weight: 30 },
  { range: "$5k-$10k", weight: 25 },
  { range: "$10k+", weight: 12 },
];

const PROC_WEIGHTS: { proc: string; weight: number }[] = [
  { proc: "Under 1 month", weight: 15 },
  { proc: "1-3 months", weight: 35 },
  { proc: "3-6 months", weight: 35 },
  { proc: "6+ months", weight: 15 },
];

const NOTE_POOL = [
  "Applied online",
  "Used immigration lawyer",
  "Rejected for insufficient funds",
  "Second attempt - approved",
  "Delayed due to missing police certificate",
  "Paid for expedited VFS appointment",
  "Remote credibility interview",
  "Requested extra bank statements",
  "Approved after submitting tax returns",
  "Filed at consulate in home country",
  "Sworn translations only",
  "Medical exam rescheduled once",
  "Employer-sponsored documentation pack",
  "Self-employed: invoices + contracts attached",
  "Real estate investment route",
  "Prior refusal; stronger file on reapply",
  "Biometrics appointment moved twice",
  "Partner included as dependent",
];

function pickWeighted<T extends string>(
  items: { value: T; weight: number }[]
): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

function pickCountry(): string {
  const tag = pickWeighted(
    COUNTRY_WEIGHTS.map(({ name, weight }) => ({
      value: name as string,
      weight,
    }))
  );
  if (tag === "__OTHER__") {
    return OTHER_COUNTRIES[Math.floor(Math.random() * OTHER_COUNTRIES.length)];
  }
  return tag;
}

function pickVisaType(): string {
  const tag = pickWeighted(
    MAIN_VISAS.map(({ visa, weight }) => ({
      value: visa as string,
      weight,
    }))
  );
  if (tag === "__OTHER__") {
    return OTHER_VISAS[Math.floor(Math.random() * OTHER_VISAS.length)];
  }
  return tag;
}

export type SyntheticCaseRow = {
  country: string;
  visa_type: string;
  income_range: string;
  result: string;
  processing_time: string;
  note: string | null;
  ip_hash: string;
  created_at: string;
};

export function generateSyntheticCaseRows(count: number): SyntheticCaseRow[] {
  const rows: SyntheticCaseRow[] = [];
  const now = new Date().toISOString();
  for (let i = 0; i < count; i++) {
    const hasNote = Math.random() < 0.3;
    rows.push({
      country: pickCountry(),
      visa_type: pickVisaType(),
      income_range: pickWeighted(
        INCOME_WEIGHTS.map(({ range, weight }) => ({
          value: range,
          weight,
        }))
      ),
      result: pickWeighted(
        RESULT_WEIGHTS.map(({ result, weight }) => ({
          value: result,
          weight,
        }))
      ),
      processing_time: pickWeighted(
        PROC_WEIGHTS.map(({ proc, weight }) => ({
          value: proc,
          weight,
        }))
      ),
      note: hasNote
        ? NOTE_POOL[Math.floor(Math.random() * NOTE_POOL.length)]
        : null,
      ip_hash: randomBytes(32).toString("hex"),
      created_at: now,
    });
  }
  return rows;
}

/** Random integer in [2, 3] inclusive. */
export function randomCronBatchSize(): number {
  return 2 + Math.floor(Math.random() * 2);
}
