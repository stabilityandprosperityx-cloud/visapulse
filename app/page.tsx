import { Suspense } from "react";
import { cookies } from "next/headers";
import { FilterBar } from "@/components/FilterBar";
import { CasesSection } from "@/components/CasesSection";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { LiveCasesMeta } from "@/components/LiveCasesMeta";
import { fetchAllCases } from "@/lib/supabase/server";
import {
  getApprovalRateByCountry,
  getResultsByVisaType,
  getWeeklySubmissions,
} from "@/lib/analytics";
import {
  approvalRate,
  averageIncomeApproved,
  filterCases,
  topVisaByResult,
} from "@/lib/stats";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function StatPill({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card px-4 py-3 sm:px-5 sm:py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-zinc-500">{sub}</p> : null}
    </div>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { country?: string; visa?: string };
}) {
  const country = searchParams.country?.trim() || null;
  const visaType = searchParams.visa?.trim() || null;

  const allCases = await fetchAllCases();
  const filtered = filterCases(allCases, country, visaType);

  const totalCount = allCases.length;
  const overallRate = approvalRate(allCases);
  const mostApproved = topVisaByResult(allCases, "approved");
  const mostRejected = topVisaByResult(allCases, "rejected");

  const selRate = approvalRate(filtered);
  const selTotal = filtered.length;
  const selAvgIncome = averageIncomeApproved(filtered);

  const rateColor =
    selRate === null
      ? "text-zinc-400"
      : selRate >= 50
        ? "text-approved"
        : "text-rejected";

  const cookieStore = cookies();
  const unlocked = cookieStore.get("visapulse_contributor")?.value === "1";

  const sortedForList = [...filtered].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const approvalByCountry = getApprovalRateByCountry(allCases);
  const resultsByVisaType = getResultsByVisaType(allCases);
  const weeklySubmissions = getWeeklySubmissions(allCases, 12);
  const weeklyCaseCount = allCases.filter((c) => {
    const t = new Date(c.created_at).getTime();
    const min = Date.now() - 12 * 7 * 24 * 60 * 60 * 1000;
    return Number.isFinite(t) && t >= min;
  }).length;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <section className="text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Real Visa Approval Data. From Real People.
        </h1>
        <LiveCasesMeta totalCount={totalCount} />
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatPill
          label="Overall approval rate"
          value={
            overallRate === null ? "—" : `${overallRate.toFixed(1)}%`
          }
          sub="All submissions"
        />
        <StatPill
          label="Total cases"
          value={totalCount.toLocaleString()}
          sub="Globally"
        />
        <StatPill
          label="Most approved visa"
          value={mostApproved ?? "—"}
          sub="By volume"
        />
        <StatPill
          label="Most rejected visa"
          value={mostRejected ?? "—"}
          sub="By volume"
        />
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-card/50 p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Filter data
        </h2>
        <div className="mt-4">
          <Suspense
            fallback={
              <div className="h-24 animate-pulse rounded-lg bg-white/5" />
            }
          >
            <FilterBar />
          </Suspense>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Approval rate (selection)
          </p>
          <p className={`mt-2 text-4xl font-bold tabular-nums ${rateColor}`}>
            {selRate === null ? "—" : `${selRate.toFixed(1)}%`}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {country || visaType
              ? "For your current filters"
              : "All cases (no filters)"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total cases (selection)
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-white">
            {selTotal.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-zinc-500">Matching filters</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Avg. income (approved)
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-accent">
            {selAvgIncome === null
              ? "—"
              : `$${selAvgIncome.toLocaleString()}`}
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Estimated midpoint from range
          </p>
        </div>
      </section>

      <AnalyticsSection
        approvalByCountry={approvalByCountry}
        resultsByVisaType={resultsByVisaType}
        weeklySubmissions={weeklySubmissions}
        weeklyCaseCount={weeklyCaseCount}
      />

      <CasesSection
        cases={sortedForList}
        totalCount={totalCount}
        unlocked={unlocked}
      />

      <aside className="mt-14 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-6 text-center sm:p-8">
        <p className="text-lg font-medium text-white sm:text-xl">
          Planning to relocate? Get your personalized step-by-step plan at{" "}
          <a
            href="https://relova.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            Relova
          </a>{" "}
          →
        </p>
      </aside>
    </div>
  );
}
