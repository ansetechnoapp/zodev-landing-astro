import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

interface Project {
  id: string;
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
}

const formatDevice = (device?: string) => {
  if (device === "mobile") return "Mobile";
  if (device === "web") return "Web";
  return "Projet";
};

const cleanCopy = (value: string) => value.replace(/\s+/g, " ").trim();

export const LandingProjects = ({ projects }: { projects: Project[] }) => {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#f7f3ec] py-14 text-slate-900 md:py-20"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-16 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">
              Projets
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Projets sélectionnés
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
              Une vitrine courte, soignée et crédible pour montrer le niveau de
              finition sur des projets web et mobile concrets.
            </p>
          </div>

          <a
            href="https://my.zodev.live"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            Voir le portfolio complet
            <ExternalLink className="h-4 w-4 text-slate-400" />
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={project.data.img}
                  alt={project.data.img_alt || project.data.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    {formatDevice(project.data.device)}
                  </span>
                  {project.data.tags?.[0] && (
                    <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                      {project.data.tags[0]}
                    </span>
                  )}
                  <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                    0{index + 1}
                  </span>
                </div>

                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                  <p className="max-w-[70%] text-xs font-medium uppercase tracking-[0.22em] text-white/80">
                    Étude de cas
                  </p>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-5 md:p-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                    {project.data.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {cleanCopy(project.data.description)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.data.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.slug ? `/work/${project.slug}/` : "https://my.zodev.live"}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
                >
                  Voir l'étude de cas
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
