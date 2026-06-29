import type { APIRoute } from "astro";
import { buildSitemapEntries, buildSitemapXml } from "../lib/sitemap";

export const prerender = true;

export const GET: APIRoute = async () => {
  const urls = await buildSitemapEntries();
  return new Response(buildSitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
