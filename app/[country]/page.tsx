import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { formatCount } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { COUNTRIES, VISA_TYPES, fromSlug, toSlug } from "@/lib/slugs";
import {
  fetchAllCases,
  fetchFilteredCaseCount,
  fetchFilteredCasesPage,
} from "@/lib/supabase/server";
import { approvalRate, averageIncomeApproved, filterCases } from "@/lib/stats";

type Props = { params: { country: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTRIES.map((country) => ({ country: toSlug(country) }));
}

function matchCountry(slug: string): string | null {
  return COUNTRIES.find((country) => toSlug(country) === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const countryName = matchCountry(params.country) ?? fromSlug(params.country);
  if (!matchCountry(params.country)) return { title: "Country not found" };
  const canonical = `${siteUrl()}/${params.country}`;
  const title = `${countryName} Visa Approval Data: Real Cases & Statistics | VisaPulse`;
  const description = `See real visa approval rates, rejection reasons, and processing times for ${countryName} based on anonymously submitted cases. Updated in real time.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const countryName = matchCountry(params.country);
  if (!countryName) notFound();

  const [listCases, allCases, dbCount] = await Promise.all([
    fetchFilteredCasesPage(countryName, null, 1, 50),
    fetchAllCases(),
    fetchFilteredCaseCount(countryName, null),
  ]);

  const filtered = filterCases(allCases, countryName, null);
  const rate = approvalRate(filtered);
  const avgIncome = averageIncomeApproved(filtered);
  const count = filtered.length;
  const recentCases = listCases.slice(0, 25);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <Link href="/" className="text-sm text-accent hover:underline">
        ← All countries
      </Link>

      <section className="mt-5 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {countryName} Visa Approval Data
        </h1>
        <p className="mt-3 text-zinc-400">
          Based on {formatCount(count)} anonymously submitted cases
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Approval Rate
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-white">
            {rate === null ? "—" : `${rate.toFixed(1)}%`}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Total Cases
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-white">
            {formatCount(dbCount)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Avg Income (approved)
          </p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-accent">
            {avgIncome === null ? "—" : `$${avgIncome.toLocaleString("en-US")}`}
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-card/50 p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Visa Types
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VISA_TYPES.map((visaType) => {
            const comboCount = filterCases(allCases, countryName, visaType).length;
            return (
              <Link
                key={visaType}
                href={`/${params.country}/${toSlug(visaType)}`}
                className="rounded-xl border border-white/10 bg-card p-4 transition hover:border-accent/40"
              >
                <p className="font-medium text-white">{visaType}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {formatCount(comboCount)} cases
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Recent Cases
        </h2>
        <div className="mt-4 grid gap-3">
          {recentCases.length > 0 ? (
            recentCases.map((c) => <CaseCard key={c.id} c={c} />)
          ) : (
            <div className="rounded-xl border border-white/10 bg-card p-5 text-zinc-400">
              No cases yet for this country.
            </div>
          )}
        </div>
      </section>

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
