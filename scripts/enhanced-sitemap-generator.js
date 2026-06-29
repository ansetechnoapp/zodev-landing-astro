import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import chalk from "chalk";
import {
  canonicalSiteOrigin,
  resolveCanonicalUrl,
} from "../src/config/site.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");

const siteUrl = canonicalSiteOrigin;

const today = new Date().toISOString().split("T")[0];

const staticPages = [
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

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  const trimmed = pathname.replace(/\/+$/, "");
  return `${trimmed}/`;
}

function toAbsoluteUrl(pathname) {
  return resolveCanonicalUrl(normalizePathname(pathname));
}

function normalizeDateValue(value) {
  if (!value) {
    return today;
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return today;
  }

  return date.toISOString().split("T")[0];
}

async function getFileLastMod(relativePath) {
  try {
    const fileStats = await fs.stat(path.join(rootDir, relativePath));
    return normalizeDateValue(fileStats.mtime);
  } catch {
    return today;
  }
}

function addUrlEntry(collection, entry) {
  if (!collection.some((item) => item.loc === entry.loc)) {
    collection.push(entry);
  }
}

async function addStaticPages(urls) {
  console.log(chalk.yellow("Adding static pages..."));

  for (const page of staticPages) {
    addUrlEntry(urls, {
      loc: toAbsoluteUrl(page.url),
      lastmod: await getFileLastMod(page.source),
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  console.log(chalk.green(`Added ${staticPages.length} static pages`));
}

async function addWorkProjects(urls) {
  console.log(chalk.yellow("Adding work project pages..."));

  const contentFiles = await glob("src/content/work/**/*.md", {
    cwd: rootDir,
    windowsPathsNoEscape: true,
  });

  for (const relativeFile of contentFiles) {
    const slug = relativeFile
      .replace(/^src[\\/]+content[\\/]+work[\\/]+/, "")
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");

    addUrlEntry(urls, {
      loc: toAbsoluteUrl(`/work/${slug}/`),
      lastmod: await getFileLastMod(relativeFile),
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  console.log(chalk.green(`Added ${contentFiles.length} work project pages`));
}

async function addBlogPosts(urls) {
  console.log(chalk.yellow("Adding blog posts..."));

  const blogPostsPath = path.join(rootDir, "src/data/blog/all-posts.json");

  try {
    const blogPostsRaw = await fs.readFile(blogPostsPath, "utf-8");
    const blogPosts = JSON.parse(blogPostsRaw);

    for (const post of blogPosts) {
      if (!post?.slug) {
        continue;
      }

      addUrlEntry(urls, {
        loc: toAbsoluteUrl(`/blog/${post.slug}/`),
        lastmod: normalizeDateValue(post.updatedDate || post.pubDate),
        changefreq: "monthly",
        priority: "0.7",
      });
    }

    console.log(chalk.green(`Added ${blogPosts.length} blog posts`));
  } catch (error) {
    console.warn(
      chalk.yellow(`Could not read blog posts: ${error instanceof Error ? error.message : error}`)
    );
  }
}

function generateSitemapXml(urls) {
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

function generateSitemapJson(urls) {
  return `${JSON.stringify(urls, null, 2)}\n`;
}

async function saveOutputs(urls) {
  await fs.writeFile(
    path.join(publicDir, "sitemap.xml"),
    generateSitemapXml(urls),
    "utf-8"
  );
  await fs.writeFile(
    path.join(publicDir, "sitemap.json"),
    generateSitemapJson(urls),
    "utf-8"
  );
  await fs.writeFile(
    path.join(publicDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    "utf-8"
  );
}

async function generateEnhancedSitemap() {
  console.log(chalk.blue.bold("SEO sitemap generation"));
  console.log(chalk.blue(`Using canonical domain: ${siteUrl}`));
  console.log("");

  const urls = [];

  await addStaticPages(urls);
  await addWorkProjects(urls);
  await addBlogPosts(urls);

  urls.sort((a, b) => a.loc.localeCompare(b.loc));

  await saveOutputs(urls);

  console.log("");
  console.log(chalk.green.bold("Sitemap and robots.txt generated successfully."));
  console.log(chalk.blue(`Total canonical URLs: ${urls.length}`));
}

generateEnhancedSitemap().catch((error) => {
  console.error(chalk.red("Failed to generate sitemap:"), error);
  process.exitCode = 1;
});
