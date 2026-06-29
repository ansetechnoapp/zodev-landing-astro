import React from "react";
import { LandingHero } from "./LandingHero";
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
  ...dataUser.skills.frameworks,
  ...dataUser.skills.databases,
  ...dataUser.skills.tools,
].slice(0, 8);

export const LandingClient = ({ projects }: LandingClientProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-cyan-500/30 dark:bg-slate-950">
      <LandingHero name={`${dataUser.firstName} ${dataUser.lastName}`} stack={stack} projectCount={projects.length} />
      <LandingProjects projects={projects} />
    </div>
  );
};
