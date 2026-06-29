# AGENTS.md

## Objectif du depot
Ce repo contient la landing page publique de `my.zodev.live` et/ou de son alias actif `www.zodev.live`.
Son role est de presenter rapidement Kevin Otty, sa stack, une selection de projets et un lien clair vers le portfolio complet.

## Nomenclature
- Regle unique: `[nom projet]-[type]-[tech]`
- Rien de plus: pas de suffixe inutile, pas de version, pas de "copy", pas de variante decorative.
- Tout nouveau dossier, repo, page ou export doit respecter cette logique.

## Regles de travail
- Utiliser `bun` pour installer, lancer et valider le projet.
- Toujours verifier avec `bun run build` avant de livrer.
- Si le contenu change, aligner aussi `title`, `description`, `canonical`, `homepageUrl`, `sitemap` et `robots`.
- Garder le ton oriente presentation, credibilite et conversion.
- Ne pas supprimer les routes legacy sans demande explicite.
- Conserver les composants existants si une adaptation suffit.

## Ce qu’il faut privilegier
- Hero court et clair.
- Stack lisible.
- Projets selectionnes.
- CTA vers le portfolio complet et le contact.
- SEO propre et coherent avec le domaine public.

## Checklist avant merge ou push
- Le build passe.
- Les liens pointent vers les bons domaines.
- Les metadata GitHub et Vercel correspondent au site.
- Aucun texte "portfolio complet" ne contredit le role de cette landing.
