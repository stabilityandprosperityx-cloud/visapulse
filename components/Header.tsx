import Link from "next/link";
import { formatCount } from "@/lib/format";

export function Header({ totalCases }: { totalCases: number }) {
  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="https://visapulse.relova.ai"
          className="group flex flex-col gap-0.5"
        >
          <span className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-accent">
            VisaPulse
          </span>
          <span className="text-xs text-zinc-500">by Relova</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/blog"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            Blog
          </Link>
          <p className="hidden items-center gap-1.5 text-sm text-zinc-500 sm:inline-flex">
            <span aria-hidden>👥</span>
            <span className="font-semibold text-[#22C55E]">
              {formatCount(totalCases)}
            </span>
            <span>cases shared</span>
          </p>
          <Link
            href="/submit"
            className="shrink-0 rounded-lg bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#16A34A]"
          >
            Submit Your Case
          </Link>
        </div>
      </div>
    </header>
  );
}
