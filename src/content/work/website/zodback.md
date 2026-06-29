---
title: ZodBack
publishDate: 2026-03-05 00:00:00
number: 14
img: /assets/myprojects/zodback-dashboard_optimized.webp
img_alt: ZodBack admin dashboard showing project selection and navigation modules
github: https://github.com/ansetechnoapp/zodback
liveDemo: https://app.zodev.live/
device: web
description: |
  ZodBack is a modular, event-driven backend platform that enables building,
  connecting, and monetizing external applications at scale. It provides
  centralized authentication, API token management, multi-project isolation,
  and a plugin-like module system — all governed by a single API with strict
  data isolation per project.
tags:
  - Backend
  - API Platform
  - Multi-tenant
  - SaaS
tech:
  - NestJS
  - TypeScript
  - Fastify
  - Next.js
  - PostgreSQL
  - Drizzle ORM
  - Redis
  - BullMQ
  - Python
  - FastAPI
  - Docker
  - Cloudflare Pages
additionalImages:
  - url: /assets/myprojects/zodback-login_optimized.webp
    alt: ZodBack admin login page
  - url: /assets/myprojects/zodback-overview_optimized.webp
    alt: ZodBack dashboard overview with applications modules
  - url: /assets/myprojects/zodback-portfolio_optimized.webp
    alt: ZodBack portfolio module with projects, skills and experiences management
---

ZodBack est une plateforme backend modulaire et event-driven conçue pour construire, connecter et monétiser des applications externes à grande échelle.

## Fonctionnalités principales

**Authentification centralisée** — Système de login admin sécurisé avec gestion des utilisateurs et des rôles.

**Architecture multi-projets** — Isolation stricte des données par projet, permettant de gérer plusieurs applications depuis un seul dashboard.

**Modules intégrés** — Blog, Portfolio, E-Commerce, E-Learning, Chats, Notes, Workspace, CV Builder, Video Shorts, Social Media — chaque module est activable et configurable par projet.

**API Token Management** — Gestion des tokens API pour connecter des applications externes à la plateforme.

**Analytics & Monitoring** — Tableau de bord avec suivi des revenus, statut système et métriques par application.

## Architecture technique

Le backend repose sur NestJS avec Fastify, PostgreSQL 16 avec Drizzle ORM pour la persistence, Redis et BullMQ pour le traitement asynchrone des événements. Le frontend admin utilise Next.js (React). Des microservices Python/FastAPI complètent l'architecture pour des traitements spécifiques. Le tout est conteneurisé avec Docker et déployé via Cloudflare Pages et GitHub Actions.
