import React from "react";
import { LandingHero } from "./LandingHero";
import { LandingFeatures } from "./LandingFeatures";
import { LandingProjects } from "./LandingProjects";
import { LandingApproach } from "./LandingApproach";
import dataUser from "../../data/User.json";
import { MessageCircleMore } from "lucide-react";

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
  const featuredProject = projects[0];
  const whatsappNumber = dataUser.phone.replace(/\D/g, "");

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f1ea] font-sans selection:bg-cyan-500/20">
      <LandingHero
        name={`${dataUser.firstName} ${dataUser.lastName}`}
        stack={stack}
        projectCount={projects.length}
        featuredProject={featuredProject}
      />
      <LandingFeatures />
      <LandingProjects projects={projects} />
      <LandingApproach />
      <section
        id="contact"
        className="relative overflow-hidden bg-[#f6f1ea] pb-16 text-slate-900 md:pb-24"
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_120px_rgba(15,23,42,0.18)] md:p-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(34,211,238,0.14), transparent 36%), radial-gradient(circle at bottom right, rgba(251,191,36,0.14), transparent 38%)",
              }}
            />

            <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                  Contact
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
                  Un projet web ou mobile à lancer ?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                  Je peux vous aider à transformer une idée en produit concret,
                  du prototype à la mise en production, avec un focus sur la
                  clarté, la performance et la fiabilité.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`mailto:${dataUser.email}`}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Écrire à {dataUser.email}
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/15 px-6 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-400/20"
                >
                  <MessageCircleMore className="mr-2 h-4 w-4" />
                  WhatsApp +229 97279001
                </a>
                <a
                  href="https://my.zodev.live"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Voir le portfolio complet
                </a>
              </div>
            </div>

            <dl className="relative mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Localisation
                </dt>
                <dd className="mt-3 text-sm text-slate-200">
                  {dataUser.address.city}, {dataUser.address.country}
                </dd>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Orientation
                </dt>
                <dd className="mt-3 text-sm text-slate-200">
                  Développement web, mobile et interfaces produit
                </dd>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Disponible
                </dt>
                <dd className="mt-3 text-sm text-slate-200">
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
