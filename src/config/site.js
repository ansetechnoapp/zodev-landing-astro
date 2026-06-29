export const canonicalSiteUrl = "https://zodev.live/";
export const canonicalSiteOrigin = "https://zodev.live";

export function resolveCanonicalUrl(pathname = "/") {
  return new URL(pathname, canonicalSiteUrl).href;
}
