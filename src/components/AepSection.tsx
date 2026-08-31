"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { aepRows } from "@/lib/portfolioContent";
import { fadeInUp, stagger } from "./motionPresets";
import SectionKicker from "./ui/SectionKicker";

function AepIntro() {
  return (
    <div className="lg:col-span-5">
      <SectionKicker>02 / framework autoral</SectionKicker>
      <h2 className="heading-gradient mt-6 max-w-[9ch] text-[clamp(3.1rem,6vw,5.6rem)] font-semibold leading-[0.91] tracking-[-0.075em]">
        Limite antes da ação.
      </h2>
      <p className="mt-8 max-w-[28rem] text-base leading-8 text-[var(--muted)] sm:text-[17px]">
        O AI Execution Protocol organiza o caminho antes da ferramenta: risco, contexto, capacidade, validação e entrega.
      </p>
      <a
        href="https://github.com/rodneigk2/ai-execution-protocol"
        target="_blank"
        rel="noopener noreferrer"
        className="fade-link mt-8 inline-flex items-center gap-2 border-b border-[var(--accent-strong)] pb-2 text-sm font-semibold text-[var(--accent)]"
      >
        <Github aria-hidden="true" size={16} />
        Ler no GitHub
        <ArrowUpRight aria-hidden="true" size={14} className="arrow" />
      </a>
    </div>
  );
}

function AepProtocolSurface() {
  return (
    <div className="bento-surface overflow-hidden rounded-2xl p-5 sm:p-6 lg:col-span-7">
      <div role="table" aria-label="Fluxo de execução do AI Execution Protocol">
        <div role="row" className="grid grid-cols-[5.3rem_1fr] gap-3 border-b border-white/[0.07] pb-4 sm:grid-cols-[5.3rem_1fr_1fr] sm:gap-5">
          <span aria-hidden="true" />
          <span role="columnheader" className="label text-[var(--quiet)]">ação</span>
          <span role="columnheader" className="label col-start-2 text-[var(--quiet)] sm:col-start-3">resposta do AEP</span>
        </div>
        {aepRows.map((row) => (
          <div
            key={row.number}
            role="row"
            className="grid grid-cols-[5.3rem_1fr] gap-3 border-b border-white/[0.07] py-6 last:border-b-0 sm:grid-cols-[5.3rem_1fr_1fr] sm:items-baseline sm:gap-5"
          >
            <span role="cell" className="label text-[var(--accent)]">{row.number}</span>
            <p role="cell" className="text-base font-semibold text-[var(--text)]">{row.action}</p>
            <p role="cell" className="col-start-2 text-sm leading-6 text-[var(--muted)] sm:col-start-3">{row.response}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-5">
        <span className="label text-[var(--quiet)]">appendix / stack</span>
        <p className="text-sm text-[var(--soft)]">Python · JavaScript · MCP · CLI · YAML · Gateways · Traces</p>
        <span className="label text-[var(--quiet)]">v0.9.0 · alpha</span>
      </div>
    </div>
  );
}

export default function AepSection() {
  return (
    <motion.section
      id="aep"
      className="border-b border-[var(--line)] bg-black scroll-mt-20"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.08 }}
    >
      <div className="mx-auto grid max-w-[1240px] gap-14 px-6 py-24 lg:grid-cols-12 lg:gap-20 lg:px-8 lg:py-32">
        <motion.div variants={fadeInUp} className="contents">
          <AepIntro />
          <AepProtocolSurface />
        </motion.div>
      </div>
    </motion.section>
  );
}
