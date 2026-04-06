import type { VisaCase } from "@/lib/types";

type CountryBucket = {
  total: number;
  approved: number;
  rejected: number;
};

export type CountryApprovalDatum = {
  country: string;
  approvalRate: number;
  volume: number;
  fill: string;
};

export type VisaTypeResultDatum = {
  visaType: string;
  approved: number;
  rejected: number;
  pending: number;
  total: number;
};

export type WeeklySubmissionDatum = {
  weekLabel: string;
  submissions: number;
};

function barColorForApprovalRate(rate: number): string {
  if (rate > 70) return "#22C55E";
  if (rate < 50) return "#EF4444";
  return "#EAB308";
}

export function getApprovalRateByCountry(
  cases: VisaCase[],
  limit = 10
): CountryApprovalDatum[] {
  const byCountry = new Map<string, CountryBucket>();
  for (const c of cases) {
    const row = byCountry.get(c.country) ?? { total: 0, approved: 0, rejected: 0 };
    row.total += 1;
    if (c.result === "approved") row.approved += 1;
    if (c.result === "rejected") row.rejected += 1;
    byCountry.set(c.country, row);
  }

  const data: CountryApprovalDatum[] = [];
  byCountry.forEach((bucket, country) => {
    if (bucket.total < 5) return;
    const decided = bucket.approved + bucket.rejected;
    if (decided === 0) return;
    const rate = Math.round((bucket.approved / decided) * 1000) / 10;
    data.push({
      country,
      approvalRate: rate,
      volume: bucket.total,
      fill: barColorForApprovalRate(rate),
    });
  });

  return data.sort((a, b) => b.volume - a.volume).slice(0, limit);
}

export function getResultsByVisaType(cases: VisaCase[]): VisaTypeResultDatum[] {
  const byVisa = new Map<string, VisaTypeResultDatum>();
  for (const c of cases) {
    const row = byVisa.get(c.visa_type) ?? {
      visaType: c.visa_type,
      approved: 0,
      rejected: 0,
      pending: 0,
      total: 0,
    };
    row.total += 1;
    if (c.result === "approved") row.approved += 1;
    else if (c.result === "rejected") row.rejected += 1;
    else row.pending += 1;
    byVisa.set(c.visa_type, row);
  }

  return Array.from(byVisa.values())
    .filter((row) => row.total >= 5)
    .sort((a, b) => b.total - a.total);
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

export function getWeeklySubmissions(
  cases: VisaCase[],
  weeks = 12
): WeeklySubmissionDatum[] {
  const now = new Date();
  const currentWeekStart = startOfWeek(now);
  const starts: Date[] = [];
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - i * 7);
    starts.push(d);
  }

  const counts = new Map<number, number>();
  starts.forEach((d) => counts.set(d.getTime(), 0));

  for (const c of cases) {
    const date = new Date(c.created_at);
    if (Number.isNaN(date.getTime())) continue;
    const week = startOfWeek(date).getTime();
    if (counts.has(week)) {
      counts.set(week, (counts.get(week) ?? 0) + 1);
    }
  }

  return starts.map((d) => ({
    weekLabel: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(d),
    submissions: counts.get(d.getTime()) ?? 0,
  }));
}
