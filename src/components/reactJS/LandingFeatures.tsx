import React from "react";
import { motion } from "framer-motion";
import { MonitorSmartphone, Code2, Palette, Zap, Sparkles } from "lucide-react";

const features = [
  {
    title: "Responsive",
    copy: "Pensé pour rester lisible et élégant sur mobile, tablette et desktop.",
    icon: MonitorSmartphone,
    accent: "text-cyan-500 dark:text-cyan-400",
  },
  {
    title: "UI animée",
    copy: "Des micro-interactions discrètes qui donnent du relief sans gêner la lecture.",
    icon: Zap,
    accent: "text-amber-500 dark:text-amber-400",
  },
  {
    title: "Design system",
    copy: "Des blocs cohérents pour montrer la qualité de l’interface et la rigueur visuelle.",
    icon: Palette,
    accent: "text-fuchsia-500 dark:text-fuchsia-400",
  },
  {
    title: "Code moderne",
    copy: "Une structure propre, maintenable et pensée pour évoluer avec de nouveaux projets.",
    icon: Code2,
    accent: "text-emerald-500 dark:text-emerald-400",
  },
];

export const LandingFeatures = () => {
  return (
    <section className="relative overflow-hidden border-y border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute -left-24 top-1/2 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" />
              Mise en avant
            </p>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 md:text-5xl">
              Une page d’accueil qui montre le niveau dès le premier scroll.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
              Le but n’est pas de tout raconter ici, mais de donner une première impression forte:
              du rythme, de la clarté et des détails qui donnent envie d’ouvrir la galerie complète.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="group rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/50 p-5 shadow-lg shadow-slate-200/40 dark:shadow-black/20 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800">
                    <feature.icon className={`h-5 w-5 ${feature.accent}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {feature.copy}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
