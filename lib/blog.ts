import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
  author: string;
  ogImage: string;
};

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): {
  frontmatter: PostFrontmatter;
  content: string;
} {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
}

export function getAllPostsMeta(): PostFrontmatter[] {
  return getPostSlugs()
    .map((slug) => {
      const { frontmatter } = getPostBySlug(slug);
      return frontmatter;
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}
