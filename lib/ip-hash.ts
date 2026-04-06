import { createHash } from "crypto";

export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "visapulse-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export function clientIpFromHeaders(h: Headers): string {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
