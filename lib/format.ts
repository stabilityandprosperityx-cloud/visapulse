/** Comma-separated integers for UI (e.g. 1873 → "1,873"). */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
