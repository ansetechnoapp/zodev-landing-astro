import fr from './fr.json';
import en from './en.json';

export type Lang = 'fr' | 'en';
export const defaultLang: Lang = 'en';
export const languages = { fr: 'Français', en: 'English' } as const;

const translations = { fr, en } as const;

/**
 * Get the full translations object for a given language.
 */
export function getTranslations(lang: Lang = defaultLang) {
  return translations[lang] ?? translations[defaultLang];
}

/**
 * Get a nested translation value by dot-notation key.
 * Example: t('nav.home', 'fr') => "Accueil"
 */
export function t(key: string, lang: Lang = defaultLang): string {
  const keys = key.split('.');
  let value: any = translations[lang] ?? translations[defaultLang];
  for (const k of keys) {
    value = value?.[k];
  }
  return typeof value === 'string' ? value : key;
}

/**
 * Get the current language from cookies (server-side) or default.
 * Use this in Astro component frontmatter.
 */
export function getLangFromCookies(cookies: { get: (name: string) => { value: string } | undefined }): Lang {
  const lang = cookies.get('preferredLanguage')?.value;
  if (lang === 'en' || lang === 'fr') return lang;
  return defaultLang;
}

/**
 * Get the current language from URL search params or cookies.
 */
export function getLangFromRequest(request: Request, cookies: { get: (name: string) => { value: string } | undefined }): Lang {
  const url = new URL(request.url);
  const paramLang = url.searchParams.get('lang');
  if (paramLang === 'en' || paramLang === 'fr') return paramLang;
  return getLangFromCookies(cookies);
}
