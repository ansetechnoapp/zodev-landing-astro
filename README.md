# zodev-landing-astro

Landing page Astro pour `zodev.live`.

Ce projet sert à présenter rapidement Kevin Otty, sa stack principale, quelques projets sélectionnés et un accès clair vers le portfolio complet sur `my.zodev.live`.

## Démarrage

```bash
pnpm install
pnpm dev
```

## Scripts utiles

- `pnpm build`
- `pnpm preview`
- `pnpm optimize-images`
- `pnpm generate-sitemap`
- `pnpm seo-audit`

## Structure

- `src/pages/index.astro` : page d’accueil landing
- `src/components/reactJS/Landing*` : blocs de présentation
- `src/lib/sitemap.ts` : génération du sitemap

## Note

Les anciennes pages de portfolio et de blog restent dans le repo pour l’historique, mais la landing principale est désormais la racine `/`.
