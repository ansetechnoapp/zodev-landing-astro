import React, { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Layers,
  Smartphone,
  Cpu,
  MapPin,
  Mail,
  Briefcase,
  Globe,
  Download,
  ChevronDown,
  ArrowRight,
  Wrench,
  Languages,
  Contact,
} from "lucide-react"

/* ─── Icon resolver ─── */
const iconMap: Record<string, React.ReactNode> = {
  "fas fa-layer-group": <Layers size={22} />,
  "fas fa-mobile-alt": <Smartphone size={22} />,
  "fas fa-microchip": <Cpu size={22} />,
  "fas fa-map-marker-alt": <MapPin size={20} />,
  "fas fa-envelope": <Mail size={20} />,
  "fas fa-briefcase": <Briefcase size={20} />,
  "fas fa-globe": <Globe size={20} />,
}

const tabIconMap: Record<string, React.ReactNode> = {
  tools: <Wrench size={14} />,
  language: <Languages size={14} />,
  "address-card": <Contact size={14} />,
}

/* ─── Types ─── */
interface SkillGroup {
  title: string
  skills: string[]
  iconClass: string
  color: string
}

interface Language {
  name: string
  level: string
  percentage: number
}

interface PersonalInfo {
  label: string
  value: string
  iconClass: string
}

interface AboutRedesignProps {
  i18n: any
  imageSrc: string
  yearsExperience: number
  skillGroups: SkillGroup[]
  languages: Language[]
  personalInfo: PersonalInfo[]
  description: string
}

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

const tabContent = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

/* ─── Social Links ─── */
const socials = [
  {
    label: "GitHub",
    url: "https://github.com/ansetechnoapp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/anscod/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    url: "https://instagram.com/anscod.otty",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    url: "https://pinterest.com/anscoddesign",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    ),
  },
]

/* ─── Main Component ─── */
export default function AboutRedesign({
  i18n,
  imageSrc,
  yearsExperience,
  skillGroups,
  languages,
  personalInfo,
  description,
}: AboutRedesignProps) {
  const [activeTab, setActiveTab] = useState("skills")
  const [isExpanded, setIsExpanded] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(0) // 0 = first group open by default

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [20, -20])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.7, 1, 1, 0.7])

  const tabs = [
    { id: "skills", label: i18n.about.toolsSkillsTab, icon: "tools" },
    { id: "languages", label: i18n.about.languagesTab, icon: "language" },
    { id: "contact", label: i18n.about.contactInfoTab, icon: "address-card" },
  ]

  return (
    <div ref={containerRef} className="relative w-full px-4 md:px-8 overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.04]" style={{ background: "var(--accent-light)", filter: "blur(120px)" }} />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.03]" style={{ background: "var(--accent-secondary-light)", filter: "blur(150px)" }} />

      <motion.div
        style={{ y, opacity }}
        className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[420px_1fr] gap-12 lg:gap-16 items-start"
      >
        {/* ═══ LEFT COLUMN: Identity Card ═══ */}
        <div className="w-full flex flex-col items-center lg:items-start gap-8">
          {/* Photo Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="relative group w-full max-w-[400px]"
          >
            <div className="relative z-10 w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg" style={{ border: "1px solid var(--gray-1002)" }}>
              <img
                src={imageSrc}
                alt="Portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Status badge */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400 mb-0.5">
                    {i18n.about.availability}
                  </p>
                  <p className="text-white font-semibold text-lg tracking-tight" style={{ fontFamily: "var(--font-brand)" }}>
                    Freelance Expert
                  </p>
                </div>
              </div>
            </div>

            {/* Experience badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-5 -right-4 z-20 px-6 py-5 rounded-2xl shadow-xl backdrop-blur-sm"
              style={{
                background: "color-mix(in srgb, var(--gray-999) 85%, transparent)",
                border: "1px solid var(--gray-1002)",
              }}
            >
              <div className="flex flex-col items-center">
                <span
                  className="text-4xl font-black leading-none"
                  style={{
                    fontFamily: "var(--font-brand)",
                    background: "linear-gradient(135deg, var(--accent-light), var(--accent-secondary-light))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {yearsExperience}+
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] mt-1.5" style={{ color: "var(--gray-400)" }}>
                  {i18n.about.yearsExperience}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA + Socials */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            custom={2}
            className="flex flex-col items-center gap-5 w-full max-w-[400px]"
          >
            <a
              href="https://bit.ly/CV_otty_kevin"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm tracking-wide overflow-hidden transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, var(--accent-regular), var(--accent-light))",
                boxShadow: "0 4px 20px rgba(118, 17, 166, 0.2)",
              }}
            >
              <Download size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              {i18n.about.viewCV}
            </a>

            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "var(--gray-1003)",
                    border: "1px solid var(--gray-1002)",
                    color: "var(--gray-400)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--accent-light)"
                    e.currentTarget.style.borderColor = "var(--accent-light)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--gray-400)"
                    e.currentTarget.style.borderColor = "var(--gray-1002)"
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ RIGHT COLUMN: Content ═══ */}
        <div className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-8"
          >
            {/* Section label */}
            <motion.div variants={fadeUp} custom={0}>
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-5"
                style={{
                  background: "var(--accent-subtle-overlay)",
                  border: "1px solid var(--gray-1002)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "var(--accent-light)",
                    boxShadow: "0 0 8px var(--accent-overlay)",
                  }}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--accent-light)" }}>
                  {i18n.about.title}
                </span>
              </div>

              <h2
                className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-6"
                style={{ fontFamily: "var(--font-brand)", color: "var(--gray-100)" }}
              >
                Crafting{" "}
                <br />
                <span
                  className="italic"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    background: "linear-gradient(135deg, var(--accent-light), var(--accent-secondary-light))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Excellence.
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp} custom={1} className="relative">
              <p
                className={`text-lg leading-relaxed transition-all duration-500 max-w-2xl ${!isExpanded ? "line-clamp-3" : ""}`}
                style={{ color: "var(--gray-400)", fontFamily: "var(--font-body)" }}
              >
                {description}
              </p>
              {!isExpanded && (
                <div
                  className="absolute bottom-0 inset-x-0 h-10 pointer-events-none"
                  style={{ background: "linear-gradient(to top, var(--gray-999), transparent)" }}
                />
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 mt-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 hover:opacity-80 active:scale-95"
                style={{ color: "var(--accent-light)" }}
              >
                {isExpanded ? i18n.about.seeLess : i18n.about.seeMore}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-400 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </motion.div>

            {/* Tab navigation */}
            <motion.div variants={fadeUp} custom={2}>
              <div
                className="inline-flex gap-1 p-1 rounded-2xl"
                style={{
                  background: "var(--gray-1003)",
                  border: "1px solid var(--gray-1002)",
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden"
                    style={{
                      color: activeTab === tab.id ? "#fff" : "var(--gray-400)",
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {tabIconMap[tab.icon]}
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="about-active-tab"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "linear-gradient(135deg, var(--accent-regular), var(--accent-light))" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab content */}
            <motion.div variants={fadeUp} custom={3} className="min-h-[380px]">
              <AnimatePresence mode="wait">
                {/* ── Skills Tab (Accordion) ── */}
                {activeTab === "skills" && (
                  <motion.div key="skills" {...tabContent} className="flex flex-col gap-3">
                    {skillGroups.map((group, gi) => {
                      const isOpen = openDropdown === gi
                      return (
                        <motion.div
                          key={group.title}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: gi * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="rounded-2xl overflow-hidden transition-all duration-300"
                          style={{
                            background: "var(--gray-1003)",
                            border: isOpen
                              ? "1px solid color-mix(in srgb, var(--accent-light) 25%, transparent)"
                              : "1px solid var(--gray-1002)",
                          }}
                        >
                          {/* Dropdown Header */}
                          <button
                            onClick={() => setOpenDropdown(isOpen ? -1 : gi)}
                            className="w-full flex items-center justify-between gap-4 p-5 cursor-pointer transition-colors duration-300"
                            style={{ background: isOpen ? "var(--accent-subtle-overlay)" : "transparent" }}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                style={{
                                  background: isOpen ? "linear-gradient(135deg, var(--accent-regular), var(--accent-light))" : "var(--accent-subtle-overlay)",
                                  color: isOpen ? "#fff" : "var(--accent-light)",
                                }}
                              >
                                {iconMap[group.iconClass] || <Layers size={20} />}
                              </div>
                              <h3
                                className="text-[15px] font-bold tracking-tight text-left"
                                style={{ color: "var(--gray-100)", fontFamily: "var(--font-brand)" }}
                              >
                                {group.title}
                              </h3>
                              <span
                                className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full"
                                style={{
                                  background: isOpen ? "rgba(255,255,255,0.15)" : "var(--gray-1002)",
                                  color: "var(--gray-400)",
                                }}
                              >
                                {group.skills.length}
                              </span>
                            </div>
                            <ChevronDown
                              size={18}
                              className="flex-shrink-0 transition-transform duration-300"
                              style={{
                                color: "var(--gray-400)",
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              }}
                            />
                          </button>

                          {/* Dropdown Content */}
                          <AnimatePresence initial={gi === 0}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 pt-1">
                                  <div className="flex flex-wrap gap-2">
                                    {group.skills.map((skill, si) => (
                                      <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: si * 0.03, duration: 0.25 }}
                                        className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 cursor-default hover:-translate-y-px"
                                        style={{
                                          background: "color-mix(in srgb, var(--gray-999) 80%, var(--gray-1002))",
                                          border: "1px solid var(--gray-1002)",
                                          color: "var(--gray-400)",
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = "var(--accent-regular)"
                                          e.currentTarget.style.borderColor = "var(--accent-regular)"
                                          e.currentTarget.style.color = "#fff"
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = "color-mix(in srgb, var(--gray-999) 80%, var(--gray-1002))"
                                          e.currentTarget.style.borderColor = "var(--gray-1002)"
                                          e.currentTarget.style.color = "var(--gray-400)"
                                        }}
                                      >
                                        {skill}
                                      </motion.span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}

                {/* ── Languages Tab ── */}
                {activeTab === "languages" && (
                  <motion.div key="languages" {...tabContent} className="flex flex-col gap-4">
                    {languages.map((lang, li) => (
                      <motion.div
                        key={lang.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: li * 0.1, duration: 0.4 }}
                        className="p-6 rounded-2xl relative overflow-hidden"
                        style={{
                          background: "var(--gray-1003)",
                          border: "1px solid var(--gray-1002)",
                        }}
                      >
                        <div className="flex justify-between items-center mb-4 relative z-10">
                          <div>
                            <h4
                              className="text-xl font-bold tracking-tight mb-0.5"
                              style={{ color: "var(--gray-100)", fontFamily: "var(--font-brand)" }}
                            >
                              {lang.name}
                            </h4>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--accent-light)" }}>
                              {lang.level}
                            </p>
                          </div>
                          <span
                            className="text-3xl font-black"
                            style={{
                              fontFamily: "var(--font-brand)",
                              color: "var(--gray-400)",
                              opacity: 0.4,
                            }}
                          >
                            {lang.percentage}%
                          </span>
                        </div>

                        <div
                          className="h-2 w-full rounded-full overflow-hidden relative z-10"
                          style={{ background: "var(--gray-1002)" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${lang.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{
                              background: "linear-gradient(90deg, var(--accent-regular), var(--accent-light), var(--accent-secondary-light))",
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* ── Contact Tab ── */}
                {activeTab === "contact" && (
                  <motion.div key="contact" {...tabContent} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {personalInfo.map((info, ci) => (
                        <motion.div
                          key={info.label}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ci * 0.08, duration: 0.4 }}
                          className="group flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 hover:shadow-sm"
                          style={{
                            background: "var(--gray-1003)",
                            border: "1px solid var(--gray-1002)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent-light) 30%, transparent)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--gray-1002)"
                          }}
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                            style={{
                              background: "var(--accent-subtle-overlay)",
                              color: "var(--accent-light)",
                            }}
                          >
                            {iconMap[info.iconClass] || <Globe size={20} />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: "var(--gray-500)" }}>
                              {info.label}
                            </p>
                            <p className="text-sm font-semibold tracking-tight truncate" style={{ color: "var(--gray-100)" }}>
                              {info.value}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Banner */}
                    <motion.a
                      href="#contact"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="group flex items-center justify-between p-8 rounded-2xl mt-2 transition-all duration-300 active:scale-[0.99]"
                      style={{
                        background: "var(--gray-0)",
                        color: "var(--gray-999)",
                        boxShadow: "var(--shadow-lg)",
                      }}
                    >
                      <div>
                        <h4
                          className="text-2xl md:text-3xl font-black mb-1 tracking-tight"
                          style={{ fontFamily: "var(--font-brand)" }}
                        >
                          {i18n.contactCTA?.title || "Let's connect."}
                        </h4>
                        <p className="text-sm opacity-60 font-medium">
                          {i18n.contact?.contactDescription?.slice(0, 60) || "Always open for innovative projects"}...
                        </p>
                      </div>
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]"
                        style={{
                          background: "linear-gradient(135deg, var(--accent-regular), var(--accent-light))",
                          boxShadow: "0 4px 20px var(--accent-overlay)",
                        }}
                      >
                        <ArrowRight size={22} />
                      </div>
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
