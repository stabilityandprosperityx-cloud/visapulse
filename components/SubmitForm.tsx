"use client";

import { useState } from "react";
import Link from "next/link";
import {
  COUNTRIES,
  INCOME_RANGES,
  PROCESSING_TIMES,
  VISA_TYPES,
  type ResultValue,
} from "@/lib/constants";

export function SubmitForm() {
  const [country, setCountry] = useState("");
  const [visaType, setVisaType] = useState("");
  const [visaTypeOther, setVisaTypeOther] = useState("");
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<ResultValue>("approved");
  const [processing, setProcessing] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          visa_type: visaType,
          visa_type_other: visaType === "Other" ? visaTypeOther.trim() : null,
          income_range: income,
          result,
          processing_time: processing,
          note: note.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-approved/40 bg-approved/10 p-8 text-center">
        <p className="text-lg font-semibold text-white">Thank you!</p>
        <p className="mt-2 text-sm text-zinc-300">
          Your case was submitted. The dashboard is updated in real time.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background hover:bg-sky-400"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-white/10 bg-card p-6 sm:p-8"
    >
      {error ? (
        <p
          className="rounded-lg border border-rejected/40 bg-rejected/10 px-3 py-2 text-sm text-rejected"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <label className="block text-sm text-zinc-400">
        Country
        <select
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-white outline-none ring-accent focus:ring-2"
        >
          <option value="" disabled>
            Select country
          </option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-zinc-400">
        Visa type
        <select
          required
          value={visaType}
          onChange={(e) => {
            const next = e.target.value;
            setVisaType(next);
            if (next !== "Other") setVisaTypeOther("");
          }}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-white outline-none ring-accent focus:ring-2"
        >
          <option value="" disabled>
            Select type
          </option>
          {VISA_TYPES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      {visaType === "Other" ? (
        <label className="block text-sm text-zinc-400">
          Specify visa type
          <input
            required
            type="text"
            value={visaTypeOther}
            onChange={(e) => setVisaTypeOther(e.target.value.slice(0, 50))}
            maxLength={50}
            placeholder="e.g. Cultural exchange permit"
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-white placeholder:text-zinc-600 outline-none ring-accent focus:ring-2"
          />
          <span className="mt-1 block text-right text-xs text-zinc-600">
            {visaTypeOther.length}/50
          </span>
        </label>
      ) : null}

      <label className="block text-sm text-zinc-400">
        Monthly income
        <select
          required
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-white outline-none ring-accent focus:ring-2"
        >
          <option value="" disabled>
            Select range
          </option>
          {INCOME_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm text-zinc-400">Result</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(
            [
              ["approved", "Approved"],
              ["rejected", "Rejected"],
              ["pending", "Pending"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-zinc-200"
            >
              <input
                type="radio"
                name="result"
                value={value}
                checked={result === value}
                onChange={() => setResult(value)}
                className="h-4 w-4 border-white/20 bg-background text-accent focus:ring-accent"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm text-zinc-400">
        Processing time
        <select
          required
          value={processing}
          onChange={(e) => setProcessing(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-background px-3 py-2.5 text-white outline-none ring-accent focus:ring-2"
        >
          <option value="" disabled>
            Select duration
          </option>
          {PROCESSING_TIMES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-zinc-400">
        Short note{" "}
        <span className="text-zinc-600">(optional, max 200 characters)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 200))}
          rows={3}
          maxLength={200}
          placeholder="Anything others should know?"
          className="mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-background px-3 py-2.5 text-white placeholder:text-zinc-600 outline-none ring-accent focus:ring-2"
        />
        <span className="mt-1 block text-right text-xs text-zinc-600">
          {note.length}/200
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-background transition hover:bg-sky-400 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit case"}
      </button>
    </form>
  );
}
