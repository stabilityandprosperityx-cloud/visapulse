"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCount } from "@/lib/format";

export function LiveCasesMeta({ totalCount }: { totalCount: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      router.refresh();
    }, 30_000);
    return () => {
      window.clearInterval(timer);
    };
  }, [router]);

  return (
    <p className="mx-auto mt-4 flex max-w-2xl items-center justify-center gap-2 text-base text-zinc-400 sm:text-lg">
      <span>{formatCount(totalCount)} cases submitted. Updated in real time.</span>
      <span className="inline-flex items-center gap-1 rounded-full border border-approved/30 bg-approved/10 px-2 py-0.5 text-xs font-medium text-approved">
        <span className="h-2 w-2 rounded-full bg-approved" aria-hidden />
        Live
      </span>
    </p>
  );
}
