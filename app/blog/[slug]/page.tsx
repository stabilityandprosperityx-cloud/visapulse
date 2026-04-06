import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { BlogPostCta } from "@/components/BlogPostCta";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const base = siteUrl();
  if (!getPostSlugs().includes(params.slug)) {
    return { title: "Post not found" };
  }
  const { frontmatter } = getPostBySlug(params.slug);
  const canonical = `${base}/blog/${params.slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical },
    authors: [{ name: frontmatter.author }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: canonical,
      type: "article",
      publishedTime: new Date(frontmatter.date).toISOString(),
      authors: [frontmatter.author],
      images: [{ url: frontmatter.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [frontmatter.ogImage],
    },
  };
}

const proseArticle =
  "prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent prose-blockquote:text-zinc-400 prose-code:text-zinc-200 prose-code:bg-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-card prose-th:text-zinc-200 prose-td:text-zinc-300";

export default function BlogPostPage({ params }: Props) {
  if (!getPostSlugs().includes(params.slug)) {
    notFound();
  }

  const { frontmatter, content } = getPostBySlug(params.slug);
  const formatted = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(frontmatter.date));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-zinc-500">
        <Link href="/blog" className="text-accent hover:underline">
          Blog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-400">{frontmatter.title}</span>
      </nav>

      <header className="mt-6 border-b border-white/10 pb-8">
        <p className="text-sm text-zinc-500">{formatted}</p>
        <p className="mt-2 text-lg text-zinc-400">{frontmatter.description}</p>
        <p className="mt-3 text-sm text-zinc-600">By {frontmatter.author}</p>
      </header>

      <article className={`${proseArticle} mt-10`}>
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>

      <BlogPostCta />
    </div>
  );
}
