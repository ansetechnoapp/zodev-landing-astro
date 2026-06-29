import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Cadrer",
    copy:
      "On clarifie le besoin, le niveau d'ambition et les priorités pour garder une trajectoire nette.",
  },
  {
    number: "02",
    title: "Concevoir",
    copy:
      "On structure l'interface, les parcours et les points de conversion avec une logique simple et élégante.",
  },
  {
    number: "03",
    title: "Livrer",
    copy:
      "On assemble, on optimise et on prépare la mise en ligne avec un soin particulier pour la finition.",
  },
];

export const LandingApproach = () => {
  return (
    <section
      id="process"
      className="relative overflow-hidden border-y border-slate-200/70 bg-[#f8f5ef] text-slate-900"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-px w-[78%] -translate-x-1/2 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              <Sparkles className="h-4 w-4" />
              Process
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Une méthode courte, claire et orientée résultat.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
              Le design doit rassurer. La structure doit rester simple. Le
              produit final doit donner une impression de maîtrise immédiate.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
                Ce que cela apporte
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Une exécution plus lisible, des livrables plus crédibles et une
                landing qui aide vraiment à convertir sans surcharger le message.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                className="group rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    {step.number}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500/70 opacity-70 transition-opacity group-hover:opacity-100" />
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.copy}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
