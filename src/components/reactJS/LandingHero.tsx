import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import dataUser from "../../data/User.json";

interface LandingHeroProps {
  name: string;
  stack: string[];
  projectCount: number;
  featuredProject?: {
    slug: string;
    data: {
      title: string;
      description: string;
      img: string;
      img_alt?: string;
      tags: string[];
      device: string;
      tech: string[];
    };
  };
}

const formatDevice = (device?: string) => {
  if (device === "mobile") return "Mobile";
  if (device === "web") return "Web";
  return "Projet";
};

const summarize = (value: string, max = 120) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;

  return `${normalized.slice(0, max - 1).trimEnd()}…`;
};

export const LandingHero = ({
  name,
  stack,
  projectCount,
  featuredProject,
}: LandingHeroProps) => {
  const city = dataUser.address.city;
  const country = dataUser.address.country;
  const featuredTech = featuredProject?.data.tech.slice(0, 3) ?? [];

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#f6f1ea] text-slate-950"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200 to-transparent lg:block" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
              Développeur web & mobile
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl md:leading-[0.95]">
              {name}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              Je conçois des interfaces web et mobiles qui restent claires,
              rapides et crédibles. Cette landing présente ma stack, mes
              savoir-faire et une sélection de projets.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Découvrir les projets
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-6 text-sm font-semibold text-slate-700 backdrop-blur transition-colors hover:border-slate-300 hover:bg-white"
              >
                Me contacter
              </a>
              <a
                href="https://service.zodev.live/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 px-6 text-sm font-semibold text-cyan-800 shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-100"
              >
                Accéder au service
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Portfolio complet sur{" "}
              <a
                href="https://my.zodev.live"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-cyan-700 hover:decoration-cyan-300"
              >
                my.zodev.live
              </a>
            </p>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Projets sélectionnés
                </dt>
                <dd className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {projectCount}
                </dd>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Une sélection courte pour garder un message net.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Stack mise en avant
                </dt>
                <dd className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {stack.length}
                </dd>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  React, Astro, mobile et intégration produit.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Basé à
                </dt>
                <dd className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {city}
                </dd>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {country} • freelance et collaborations ciblées.
                </p>
              </div>
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-cyan-400/20 via-transparent to-amber-300/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-4 shadow-[0_30px_120px_rgba(15,23,42,0.18)]">
              <div
                className="absolute inset-0 rounded-[2rem]"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(251,191,36,0.18), transparent 38%)",
                }}
              />

              <div className="relative rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                      Selected case study
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      {featuredProject?.data.title || "Projet mis en avant"}
                    </h2>
                  </div>

                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {formatDevice(featuredProject?.data.device)}
                  </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-900">
                  {featuredProject ? (
                    <img
                      src={featuredProject.data.img}
                      alt={
                        featuredProject.data.img_alt ||
                        featuredProject.data.title
                      }
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center px-6 py-14 text-center">
                      <div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-300">
                          <Zap className="h-7 w-7" />
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-300">
                          Une sélection de projets premium apparaîtra ici.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Aperçu
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {featuredProject
                        ? summarize(featuredProject.data.description)
                        : "Un aperçu de mon travail le plus récent et le plus soigné."}
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Repères
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      <li className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-300" />
                        {city}, {country}
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-300" />
                        {projectCount} projets sélectionnés
                      </li>
                      <li className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-cyan-300" />
                        {stack.length} briques stack
                      </li>
                    </ul>
                  </div>
                </div>

                {featuredProject?.slug && (
                  <a
                    href={`/work/${featuredProject.slug}/`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition-colors hover:text-cyan-100"
                  >
                    Voir l'étude de cas
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredTech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
