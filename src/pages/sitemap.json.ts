import type { APIRoute } from "astro";
import { buildSitemapEntries, buildSitemapJson } from "../lib/sitemap";

export const prerender = true;

export const GET: APIRoute = async () => {
  const urls = await buildSitemapEntries();
  return new Response(buildSitemapJson(urls), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
