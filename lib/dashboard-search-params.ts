/** Build `/?country=…&visa=…&page=…` for dashboard links (page 1 omits `page`). */
export function buildDashboardPath(opts: {
  country?: string | null;
  visa?: string | null;
  page?: number;
  submitted?: boolean;
}): string {
  const sp = new URLSearchParams();
  if (opts.country) sp.set("country", opts.country);
  if (opts.visa) sp.set("visa", opts.visa);
  if (opts.page !== undefined && opts.page > 1) sp.set("page", String(opts.page));
  if (opts.submitted) sp.set("submitted", "1");
  const q = sp.toString();
  return q ? `/?${q}` : "/";
}
