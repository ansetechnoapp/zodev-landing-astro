import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

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

const formatDevice = (device?: string) => {
  if (device === "mobile") return "Mobile";
  if (device === "web") return "Web";
  return "Projet";
};

export const LandingProjects = ({ projects }: { projects: Project[] }) => {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-white py-14 text-slate-900 dark:bg-slate-950 dark:text-slate-50 md:py-20"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-16 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-400">
              Projets
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Projets sélectionnés
            </h2>
          </div>

          <a
            href="https://my.zodev.live"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-cyan-500/40 hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800/80"
          >
            Voir le portfolio complet
            <ExternalLink className="h-4 w-4 text-slate-400" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-slate-50/90 shadow-lg shadow-slate-200/40 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/50 dark:shadow-black/20"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.data.img}
                  alt={project.data.img_alt || project.data.title}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    {formatDevice(project.data.device)}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                    0{index + 1}
                  </span>
                </div>
              </div>

              <div className="space-y-4 p-5 md:p-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    {project.data.title}
                  </h3>
                  <p className="mt-3 max-h-20 overflow-hidden text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {project.data.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.data.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
