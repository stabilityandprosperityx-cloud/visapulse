import type { VisaCase } from "@/lib/types";
import { flagForCountry } from "@/lib/flags";
import { RESULT_LABELS, type ResultValue } from "@/lib/constants";

function resultStyle(result: string) {
  if (result === "approved") return "text-approved";
  if (result === "rejected") return "text-rejected";
  return "text-pending";
}

function resultIcon(result: string) {
  if (result === "approved") return "✅";
  if (result === "rejected") return "❌";
  return "⏳";
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CaseCard({ c }: { c: VisaCase }) {
  const r = c.result as ResultValue;
  const label = RESULT_LABELS[r] ?? c.result;

  return (
    <article className="rounded-xl border border-white/10 bg-card p-4 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden>
            {flagForCountry(c.country)}
          </span>
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{c.country}</p>
            <p className="text-sm text-zinc-400 truncate">{c.visa_type}</p>
          </div>
        </div>
        <p
          className={`shrink-0 text-sm font-medium ${resultStyle(c.result)}`}
        >
          <span className="mr-1">{resultIcon(c.result)}</span>
          {label}
        </p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-zinc-500">Income</dt>
          <dd className="text-zinc-200">{c.income_range}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Submitted</dt>
          <dd className="text-zinc-200">{formatDate(c.created_at)}</dd>
        </div>
      </dl>
    </article>
  );
}
