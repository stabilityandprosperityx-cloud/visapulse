import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "VisaPulse Blog — Visa guides, data, and approval insights",
  description:
    "Research-backed articles on digital nomad visas, golden visas, work permits, rejection reasons, processing times, and how income affects outcomes—plus links to crowdsourced VisaPulse data.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "VisaPulse Blog",
    description:
      "Visa approval rates, requirements, and real-applicant context for 2026.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Blog
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Guides backed by real visa outcomes
      </h1>
      <p className="mt-4 text-lg text-zinc-400">
        Deep dives on approval rates, documents, income rules, and what actually
        gets applications refused—paired with live crowdsourced stats on{" "}
        <a
          href="https://visapulse.relova.ai"
          className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          visapulse.relova.ai
        </a>
        .
      </p>

      <ul className="mt-12 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="rounded-2xl border border-white/10 bg-card p-6 transition hover:border-accent/30">
              <time
                dateTime={post.date}
                className="text-sm text-zinc-500"
              >
                {new Intl.DateTimeFormat("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(post.date))}
              </time>
              <h2 className="mt-2 text-xl font-semibold text-white">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-accent"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-zinc-400">{post.description}</p>
              <p className="mt-1 text-xs text-zinc-600">By {post.author}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-medium text-accent hover:underline"
              >
                Read article →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
