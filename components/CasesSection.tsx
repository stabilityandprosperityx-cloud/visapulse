import Link from "next/link";
import type { VisaCase } from "@/lib/types";
import { CaseCard } from "@/components/CaseCard";

const FREE_VISIBLE = 10;
const LIST_LIMIT = 20;

export function CasesSection({
  cases,
  totalCount,
  unlocked,
}: {
  cases: VisaCase[];
  totalCount: number;
  unlocked: boolean;
}) {
  const display = cases.slice(0, LIST_LIMIT);
  const head = display.slice(0, FREE_VISIBLE);
  const tail = display.slice(FREE_VISIBLE);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-white">Latest cases</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Showing {display.length} of {totalCount} total submissions
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {head.map((c) => (
          <li key={c.id}>
            <CaseCard c={c} />
          </li>
        ))}
      </ul>

      {tail.length > 0 && (
        <div className="relative mt-4">
          {unlocked ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {tail.map((c) => (
                <li key={c.id}>
                  <CaseCard c={c} />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <ul
                className="grid gap-4 blur-sm sm:grid-cols-2 pointer-events-none select-none"
                aria-hidden
              >
                {tail.map((c) => (
                  <li key={c.id}>
                    <CaseCard c={c} />
                  </li>
                ))}
              </ul>
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="max-w-md rounded-2xl border border-white/10 bg-background/95 p-6 text-center shadow-2xl backdrop-blur-sm">
                  <p className="text-base font-medium text-white">
                    See all {totalCount} cases
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Submit your own case to unlock the full list.
                  </p>
                  <Link
                    href="/submit"
                    className="mt-4 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-sky-400"
                  >
                    Submit your case
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
