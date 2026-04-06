import Link from "next/link";
import { buildDashboardPath } from "@/lib/dashboard-search-params";
import { formatCount } from "@/lib/format";
import { CASES_PER_PAGE, getPageNavItems } from "@/lib/pagination";
import type { VisaCase } from "@/lib/types";
import { CaseCard } from "@/components/CaseCard";

export function CasesSection({
  cases,
  totalCount,
  currentPage,
  totalPages,
  country,
  visaType,
}: {
  cases: VisaCase[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  country: string | null;
  visaType: string | null;
}) {
  const start =
    totalCount === 0 ? 0 : (currentPage - 1) * CASES_PER_PAGE + 1;
  const end =
    totalCount === 0 ? 0 : Math.min(start + cases.length - 1, totalCount);

  const navItems = getPageNavItems(currentPage, totalPages);
  const prevHref = buildDashboardPath({
    country,
    visa: visaType,
    page: currentPage > 2 ? currentPage - 1 : undefined,
  });
  const nextHref = buildDashboardPath({
    country,
    visa: visaType,
    page: currentPage + 1 <= totalPages ? currentPage + 1 : totalPages,
  });

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-white">Latest cases</h2>
      <p className="mt-1 text-sm text-zinc-500">
        {totalCount === 0 ? (
          <>No cases match your filters yet.</>
        ) : (
          <>
            Showing {formatCount(start)}–{formatCount(end)} of{" "}
            {formatCount(totalCount)} cases
          </>
        )}
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {cases.map((c) => (
          <li key={c.id}>
            <CaseCard c={c} />
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center"
          aria-label="Case list pagination"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {currentPage <= 1 ? (
              <span className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-600">
                Previous
              </span>
            ) : (
              <Link
                href={prevHref}
                className="rounded-lg border border-white/15 bg-card px-3 py-2 text-sm text-white transition hover:border-accent/50 hover:text-accent"
              >
                Previous
              </Link>
            )}
            {navItems.map((item, i) =>
              item.kind === "ellipsis" ? (
                <span
                  key={`e-${i}`}
                  className="px-1 text-sm text-zinc-500"
                  aria-hidden
                >
                  …
                </span>
              ) : item.page === currentPage ? (
                <span
                  key={item.page}
                  className="rounded-lg border border-accent bg-accent/15 px-3 py-2 text-sm font-semibold text-accent"
                  aria-current="page"
                >
                  {item.page}
                </span>
              ) : (
                <Link
                  key={item.page}
                  href={buildDashboardPath({
                    country,
                    visa: visaType,
                    page: item.page,
                  })}
                  className="rounded-lg border border-white/15 bg-card px-3 py-2 text-sm text-zinc-300 transition hover:border-white/30 hover:text-white"
                >
                  {item.page}
                </Link>
              )
            )}
            {currentPage >= totalPages ? (
              <span className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-600">
                Next
              </span>
            ) : (
              <Link
                href={nextHref}
                className="rounded-lg border border-white/15 bg-card px-3 py-2 text-sm text-white transition hover:border-accent/50 hover:text-accent"
              >
                Next
              </Link>
            )}
          </div>
        </nav>
      ) : null}

      <div className="mt-8 flex justify-center">
        <Link
          href="/submit"
          className="inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-sky-400"
        >
          Submit your case
        </Link>
      </div>
    </section>
  );
}
