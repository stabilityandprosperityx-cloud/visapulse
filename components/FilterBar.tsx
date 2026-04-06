"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { COUNTRIES, VISA_TYPES } from "@/lib/constants";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const country = searchParams.get("country") ?? "";
  const visa = searchParams.get("visa") ?? "";

  const update = useCallback(
    (next: { country?: string; visa?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const c = next.country !== undefined ? next.country : country;
      const v = next.visa !== undefined ? next.visa : visa;
      if (c) params.set("country", c);
      else params.delete("country");
      if (v) params.set("visa", v);
      else params.delete("visa");
      const q = params.toString();
      startTransition(() => {
        router.push(q ? `/?${q}` : "/");
      });
    },
    [country, visa, router, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <label className="flex flex-1 flex-col gap-1.5 text-sm text-zinc-400">
        Country
        <select
          value={country}
          onChange={(e) => update({ country: e.target.value })}
          disabled={pending}
          className="rounded-lg border border-white/10 bg-card px-3 py-2.5 text-white outline-none ring-accent focus:ring-2"
        >
          <option value="">All countries</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-sm text-zinc-400">
        Visa type
        <select
          value={visa}
          onChange={(e) => update({ visa: e.target.value })}
          disabled={pending}
          className="rounded-lg border border-white/10 bg-card px-3 py-2.5 text-white outline-none ring-accent focus:ring-2"
        >
          <option value="">All types</option>
          {VISA_TYPES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
