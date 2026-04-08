import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/blog";
import { siteUrl } from "@/lib/site";
import { COUNTRIES, VISA_TYPES, toSlug } from "@/lib/slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const posts = getPostSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));
  const countryPages = COUNTRIES.map((country) => ({
    url: `${base}/${toSlug(country)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));
  const countryVisaPages = COUNTRIES.flatMap((country) =>
    VISA_TYPES.map((visaType) => ({
      url: `${base}/${toSlug(country)}/${toSlug(visaType)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))
  );

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    ...countryPages,
    ...countryVisaPages,
    ...posts,
  ];
}
