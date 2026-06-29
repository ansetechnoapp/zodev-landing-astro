import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface LandingHeroProps {
  name: string;
  stack: string[];
  projectCount: number;
}

export const LandingHero = ({ name, stack, projectCount }: LandingHeroProps) => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-cyan-600 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 dark:text-cyan-400">
              <Sparkles className="h-3.5 w-3.5" />
              Développeur web & mobile
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {name}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
              Je conçois des interfaces, des applications et des expériences
              digitales rapides, lisibles et prêtes à évoluer. Cette landing
              page résume ma stack, mes spécialités et quelques projets choisis.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#projects"
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200"
              >
                Voir les projets
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="https://my.zodev.live"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-500/40 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Portfolio complet
              </a>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {projectCount} projets sélectionnés
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
