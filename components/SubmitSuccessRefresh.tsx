"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** After /submit, we land on /?submitted=1 so refresh runs on the dashboard route, not /submit. */
export function SubmitSuccessRefresh() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    if (searchParams.get("submitted") !== "1") return;
    ran.current = true;
    router.refresh();
    router.replace("/", { scroll: false });
  }, [router, searchParams]);

  return null;
}
