"use client";

import { Bot, Code2, Database, Layers3 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "./motionPresets";

const stacks = [
  {
    icon: Code2,
    title: "Frontend & Interfaces",
    text: "Next.js, React, Tailwind, TypeScript e Framer Motion para telas rápidas, responsivas e bem acabadas.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "HTML", "CSS"],
  },
  {
    icon: Database,
    title: "Backend & Dados",
    text: "Python, SQL, PostgreSQL, Redis e integrações com bases legadas para regras de negócio confiáveis.",
    tags: ["Python", "PostgreSQL", "Redis", "SQL", "Firebird"],
  },
  {
    icon: Bot,
    title: "BI & Automações",
    text: "Dashboards, automações e rotinas que tiram trabalho manual da operação e melhoram a tomada de decisão.",
    tags: ["Dash", "Plotly", "Pandas", "Docker", "WhatsApp"],
  },
];

const signals = [
  { label: "Leitura", value: "88", className: "h-16 bg-white/20" },
  { label: "Fluxo", value: "92", className: "h-24 bg-[rgba(125,211,252,0.42)]" },
  { label: "Dados", value: "96", className: "h-32 bg-[rgba(125,211,252,0.78)]" },
  { label: "Entrega", value: "99", className: "h-36 bg-[var(--accent)]" },
];

export default function Skills() {
  return (
    <motion.section
      id="skills"
      className="section-shell grid gap-6 xl:grid-cols-[0.82fr_1.18fr]"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.03, margin: "0px 0px -12% 0px" }}
    >
      <motion.div variants={fadeInUp} className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:rounded-[3rem] lg:p-12">
        <span className="eyebrow">Stack</span>
        <h2 className="section-title mt-5 font-bold">Tecnologia escolhida por função.</h2>
        <p className="section-copy mt-5">
          A stack não aparece como vitrine solta. Ela precisa servir o projeto: interface,
          dados, regras, performance e manutenção.
        </p>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[var(--accent)]/10 text-[var(--accent)]">
              <Layers3 size={22} />
            </span>
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Critério
              </p>
              <p className="mt-1 font-display text-xl font-bold">Primeiro o problema, depois a ferramenta.</p>
            </div>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Mapear o fluxo real", "Construir com base escalável"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-display text-3xl font-bold text-white/90">0{index + 1}</p>
                <p className="mt-4 text-sm leading-6 text-white/60">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          {stacks.slice(0, 2).map(({ icon: Icon, title, text, tags }) => (
            <article key={title} className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:rounded-[2.5rem]">
              <Icon className="text-[var(--accent)]" size={34} />
              <h3 className="mt-8 font-display text-2xl font-bold">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/60">{text}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <article className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:rounded-[2.5rem]">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Bot className="text-[var(--accent)]" size={34} />
              <h3 className="mt-7 font-display text-3xl font-bold sm:text-4xl">{stacks[2].title}</h3>
              <p className="mt-4 text-base leading-7 text-white/60">{stacks[2].text}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {stacks[2].tags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">
                  KPI Signals
                </p>
                <span className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-3 py-1 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[var(--accent)]">
                  live data
                </span>
              </div>
              <div className="mt-6 flex h-48 items-end gap-3">
                {signals.map((item) => (
                  <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <span className="text-center font-mono text-[0.58rem] font-bold text-white/70">{item.value}</span>
                    <span className={`block w-full rounded-2xl ${item.className}`} />
                    <span className="text-center font-mono text-[0.5rem] uppercase tracking-[0.12em] text-white/40">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </motion.div>
    </motion.section>
  );
}


