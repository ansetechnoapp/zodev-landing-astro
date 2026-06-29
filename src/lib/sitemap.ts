import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getCollection } from "astro:content";
import allPosts from "../data/blog/all-posts.json";
import { canonicalSiteOrigin, resolveCanonicalUrl } from "../config/site.js";

export type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..", "..");
const today = new Date().toISOString().split("T")[0];

const staticPages: Array<{
  url: string;
  source: string;
  priority: string;
  changefreq: string;
}> = [
  {
    url: "/",
    source: "src/pages/index.astro",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    url: "/work/",
    source: "src/pages/work.astro",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    url: "/blog/",
    source: "src/pages/blog/index.astro",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    url: "/widgetCss/",
    source: "src/pages/widgetCss.astro",
    priority: "0.6",
    changefreq: "monthly",
  },
];

function normalizePathname(pathname: string) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const trimmed = pathname.replace(/\/+$/, "");
  return `${trimmed}/`;
}

function normalizeDateValue(value: string | Date | undefined) {
  if (!value) {
    return today;
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return today;
  }

  return date.toISOString().split("T")[0];
}

async function getFileLastMod(relativePath: string) {
  try {
    const fileStats = await fs.stat(path.join(rootDir, relativePath));
    return normalizeDateValue(fileStats.mtime);
  } catch {
    return today;
  }
}

function addUrlEntry(collection: SitemapEntry[], entry: SitemapEntry) {
  if (!collection.some((item) => item.loc === entry.loc)) {
    collection.push(entry);
  }
}

export async function buildSitemapEntries() {
  const urls: SitemapEntry[] = [];

  for (const page of staticPages) {
    addUrlEntry(urls, {
      loc: resolveCanonicalUrl(normalizePathname(page.url)),
      lastmod: await getFileLastMod(page.source),
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  const workEntries = await getCollection("work");
  for (const entry of workEntries) {
    addUrlEntry(urls, {
      loc: resolveCanonicalUrl(
        normalizePathname(`/work/${entry.slug}`)
      ),
      lastmod: normalizeDateValue(entry.data.publishDate),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  for (const post of allPosts as Array<{
    slug?: string;
    pubDate?: string;
    updatedDate?: string;
  }>) {
    if (!post.slug) {
      continue;
    }

    addUrlEntry(urls, {
      loc: resolveCanonicalUrl(
        normalizePathname(`/blog/${post.slug}`)
      ),
      lastmod: normalizeDateValue(post.updatedDate || post.pubDate),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  return urls;
}

export function buildSitemapXml(urls: SitemapEntry[]) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const url of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${url.loc}</loc>`);
    lines.push(`    <lastmod>${url.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
    lines.push(`    <priority>${url.priority}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return `${lines.join("\n")}\n`;
}

export function buildSitemapJson(urls: SitemapEntry[]) {
  return `${JSON.stringify(urls, null, 2)}\n`;
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${canonicalSiteOrigin}/sitemap.xml
`;
}
