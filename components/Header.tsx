import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex flex-col gap-0.5">
          <span className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-accent">
            VisaPulse
          </span>
          <span className="text-xs text-zinc-500">by Relova</span>
        </Link>
        <Link
          href="/submit"
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background transition hover:bg-sky-400"
        >
          Submit Your Case
        </Link>
      </div>
    </header>
  );
}
