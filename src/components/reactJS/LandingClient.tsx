import React from "react";
import { LandingHero } from "./LandingHero";
import { LandingFeatures } from "./LandingFeatures";
import { LandingProjects } from "./LandingProjects";
import dataUser from "../../data/User.json";

interface Project {
  id: string;
  data: {
    title: string;
    description: string;
    img: string;
    img_alt?: string;
    tags: string[];
    device: string;
    tech: string[];
  };
}

interface LandingClientProps {
  projects: Project[];
}

const stack = [
  "ReactJS",
  "Next.js",
  "Astro.js",
  "React Native",
  "TypeScript",
  "Supabase",
  "Tailwind CSS",
  "Cloudflare",
];

export const LandingClient = ({ projects }: LandingClientProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-cyan-500/30 dark:bg-slate-950">
      <LandingHero
        name={`${dataUser.firstName} ${dataUser.lastName}`}
        stack={stack}
        projectCount={projects.length}
      />
      <LandingFeatures />
      <LandingProjects projects={projects} />
      <section
        id="contact"
        className="relative overflow-hidden bg-white pb-16 text-slate-900 dark:bg-slate-950 dark:text-slate-50 md:pb-24"
      >
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50 dark:shadow-black/20 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-400">
              Contact
            </p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Un projet web ou mobile à lancer ?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
                  Je peux vous aider à transformer une idée en produit concret,
                  du prototype à la mise en production, avec un focus sur la
                  clarté, la performance et la fiabilité.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${dataUser.email}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Écrire à {dataUser.email}
                </a>
                <a
                  href="https://my.zodev.live"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-500/40 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Voir le portfolio complet
                </a>
              </div>
            </div>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <dt className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                  Localisation
                </dt>
                <dd className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {dataUser.address.city}, {dataUser.address.country}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <dt className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                  Orientation
                </dt>
                <dd className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  Développement web, mobile et interfaces produit
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <dt className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
                  Disponible
                </dt>
                <dd className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  Pour missions freelance et collaborations ciblées
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};
