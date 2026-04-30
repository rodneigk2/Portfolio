"use client";

import { CheckCircle2, Cpu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "./motionPresets";

const principles = [
  {
    title: "Clareza antes de complexidade",
    text: "Eu organizo a regra, o fluxo e a interface para o sistema ser fácil de entender e manter.",
  },
  {
    title: "Acabamento de produto",
    text: "A entrega precisa funcionar bem, mas também precisa passar confiança para quem usa.",
  },
  {
    title: "Base pronta para crescer",
    text: "Arquitetura, dados e integrações são pensados para evoluir sem virar bagunça.",
  },
];

const highlights = [
  "Sistemas sob medida",
  "Dashboards e BI",
  "ERPs e fluxos internos",
  "Integrações com bancos legados",
  "Automações comerciais",
  "UX/UI para operação",
];

export default function About() {
  return (
    <motion.section
      id="about"
      className="section-shell grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.03, margin: "0px 0px -12% 0px" }}
    >
      <motion.div variants={fadeInUp} className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:rounded-[3rem] lg:p-12">
        <span className="eyebrow">Sobre</span>
        <h2 className="section-title mt-5 font-bold">Código sólido para problema real.</h2>
        <p className="section-copy mt-5">
          Meu trabalho fica no encontro entre produto, dados e operação: eu transformo processos
          confusos em interfaces claras, regras confiáveis e sistemas que ajudam a empresa a decidir
          melhor.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <span key={item} className="tag-chip">
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid gap-4">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8 lg:rounded-[3rem]">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[var(--accent)]/10 text-[var(--accent)]">
              <Cpu size={23} />
            </span>
            <div>
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Como eu trabalho
              </p>
              <h3 className="mt-1 font-display text-2xl font-bold">Primeiro o fluxo. Depois a ferramenta.</h3>
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            {principles.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={19} />
                  <div>
                    <h4 className="font-display text-lg font-bold">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 lg:rounded-[2.5rem]">
          <div className="flex items-center gap-3 text-[var(--accent-warm)]">
            <Sparkles size={18} />
            <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em]">
              Direção
            </p>
          </div>
          <p className="mt-4 text-lg leading-8 text-white/70">
            Custo-benefício, acabamento e resultado prático. Esse é o lugar onde o portfolio precisa
            bater: bonito o suficiente para vender, sólido o suficiente para usar.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}


