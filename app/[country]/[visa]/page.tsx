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

type Props = { params: { country: string; visa: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return COUNTRIES.flatMap((country) =>
    VISA_TYPES.map((visa) => ({
      country: toSlug(country),
      visa: toSlug(visa),
    }))
  );
}

function matchCountry(slug: string): string | null {
  return COUNTRIES.find((country) => toSlug(country) === slug) ?? null;
}

function matchVisa(slug: string): string | null {
  return VISA_TYPES.find((visa) => toSlug(visa) === slug) ?? null;
}

function visaDescription(visaName: string, countryName: string): string {
  switch (visaName) {
    case "Digital Nomad":
      return `The Digital Nomad visa allows remote workers and freelancers to legally live and work in ${countryName} while employed by foreign companies or clients.`;
    case "Tourist":
      return "A Tourist visa permits short-term stays for leisure or travel purposes, typically 30–90 days without the right to work.";
    case "Work Permit":
      return `A Work Permit grants the right to be employed by a local company in ${countryName}, usually requiring a job offer before applying.`;
    case "Golden Visa / Investor":
      return "The Golden Visa is a residency-by-investment program that grants long-term residency in exchange for qualifying financial investments.";
    case "Retirement / Passive Income (D7, etc.)":
      return "The Passive Income or D7 visa is designed for retirees and remote earners who can demonstrate sufficient passive income to support themselves.";
    case "Student":
      return "A Student visa permits enrollment in accredited educational institutions and typically restricts or limits work rights.";
    case "Freelancer Visa":
      return "The Freelancer visa allows self-employed individuals to legally operate as independent contractors or consultants.";
    case "Family Reunification":
      return "Family Reunification visas allow foreign nationals to join a family member who is already a legal resident or citizen.";
    case "Startup / Entrepreneur Visa":
      return "The Startup visa is designed for entrepreneurs launching a new business, often requiring a business plan and minimum investment.";
    default:
      return `This visa category covers cases submitted under ${visaName} in ${countryName}.`;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const countryName = matchCountry(params.country) ?? fromSlug(params.country);
  const visaName = matchVisa(params.visa) ?? fromSlug(params.visa);
  if (!matchCountry(params.country) || !matchVisa(params.visa)) {
    return { title: "Page not found" };
  }

  const count = await fetchFilteredCaseCount(countryName, visaName);
  const canonical = `${siteUrl()}/${params.country}/${params.visa}`;
  const title = `${countryName} ${visaName}: Real Approval Rate & Cases | VisaPulse`;
  const description = `${count} real cases for ${visaName} in ${countryName}. See approval rate, average income of approved applicants, and anonymously submitted experiences.`;

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

export default async function CountryVisaPage({ params }: Props) {
  const countryName = matchCountry(params.country);
  const visaName = matchVisa(params.visa);
  if (!countryName || !visaName) notFound();

  const [listCases, allCases, dbCount] = await Promise.all([
    fetchFilteredCasesPage(countryName, visaName, 1, 50),
    fetchAllCases(),
    fetchFilteredCaseCount(countryName, visaName),
  ]);

  const filtered = filterCases(allCases, countryName, visaName);
  const rate = approvalRate(filtered);
  const avgIncome = averageIncomeApproved(filtered);
  const recentCases = listCases.slice(0, 25);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-sm text-accent hover:underline">
          ← All countries
        </Link>
        <Link href={`/${params.country}`} className="text-sm text-accent hover:underline">
          ← {countryName}
        </Link>
      </div>

      <section className="mt-5 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          {countryName} {visaName}
        </h1>
        <p className="mt-3 text-zinc-400">
          Based on {formatCount(filtered.length)} anonymously submitted cases
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
          About this visa
        </h2>
        <p className="mt-4 text-zinc-300">{visaDescription(visaName, countryName)}</p>
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
              No cases yet for this country and visa type.
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
