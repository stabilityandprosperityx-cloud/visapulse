"use client";

import { useEffect, useRef, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * After /submit we land on /?submitted=1. We strip the param first, then refresh `/`
 * so the client does not reuse a stale prefetched `/` payload (refresh-then-replace
 * was cancelling the in-flight RSC refetch).
 */
export function SubmitSuccessRefresh() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (searchParams.get("submitted") !== "1") return;
    ran.current = true;
    router.replace("/", { scroll: false });
    const t = window.setTimeout(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 0);
    return () => window.clearTimeout(t);
  }, [router, searchParams]);

  return null;
}
