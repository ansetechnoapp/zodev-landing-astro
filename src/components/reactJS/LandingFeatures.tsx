import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Layers3,
  MonitorSmartphone,
  RefreshCw,
  Smartphone,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Développement web",
    copy: "Sites vitrines, landing pages et dashboards rapides, clairs et fiables.",
    icon: MonitorSmartphone,
    accent: "text-cyan-700",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Développement mobile",
    copy: "Applications React Native pensées pour la fluidité, la stabilité et l'usage réel.",
    icon: Smartphone,
    accent: "text-amber-700",
    bg: "bg-amber-500/10",
  },
  {
    title: "Intégration produit",
    copy: "UI sur mesure, composants réutilisables et connexion propre aux API et aux données.",
    icon: Layers3,
    accent: "text-slate-900",
    bg: "bg-slate-900/10",
  },
  {
    title: "Maintenance & évolution",
    copy: "Corrections, optimisations continues et montée en version sans casser l'existant.",
    icon: RefreshCw,
    accent: "text-emerald-700",
    bg: "bg-emerald-500/10",
  },
];

export const LandingFeatures = () => {
  return (
    <section
      id="services"
      className="relative overflow-hidden border-y border-slate-200/70 bg-white text-slate-900"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="absolute -left-24 top-1/2 h-64 w-64 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-amber-400/8 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              <Sparkles className="h-4 w-4" />
              Expertise
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Un cadre lisible pour présenter ce que je fais, sans bruit visuel.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
              Cette section privilégie les compétences concrètes et les
              livrables clairs plutôt qu'une liste trop longue de mots-clés.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[#f8f5ef] p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                  <Code2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Positionnement
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Pensé pour inspirer confiance, clarifier l'offre et
                    orienter vers le contact sans surcharge.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="group rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-slate-200 ${feature.bg}`}
                  >
                    <feature.icon className={`h-5 w-5 ${feature.accent}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
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
