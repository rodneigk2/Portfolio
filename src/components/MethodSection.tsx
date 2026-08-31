"use client";

import { motion } from "framer-motion";
import { stackGroups, workflowSteps } from "@/lib/portfolioContent";
import { fadeInUp, stagger } from "./motionPresets";
import SectionKicker from "./ui/SectionKicker";

function WorkflowSpine() {
  return (
    <div className="bento-surface rounded-2xl p-5 sm:p-6 lg:col-span-6">
      <div className="border-l-2 border-[var(--accent-strong)] pl-5 sm:pl-6">
        {workflowSteps.map((step, index) => (
          <article key={step.number} className={index < workflowSteps.length - 1 ? "border-b border-white/[0.07] py-6 first:pt-0" : "pt-6"}>
            <p className="label text-[var(--accent)]">{step.number} / {step.phase}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function StackBento() {
  return (
    <div className="lg:col-span-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {stackGroups.map((group, index) => (
          <article
            key={group.label}
            className={`bento-surface rounded-2xl p-5 ${index === 0 || index === 3 ? "sm:col-span-2" : ""}`}
          >
            <p className="label text-[var(--quiet)]">{group.label}</p>
            <p className="mt-4 text-lg font-semibold leading-7 tracking-[-0.03em] text-[var(--soft)]">{group.value}</p>
          </article>
        ))}
      </div>
      <div className="bento-surface mt-3 rounded-2xl border-l-2 border-l-[var(--accent-strong)] p-5 sm:p-6">
        <p className="label text-[var(--accent)]">critério de decisão</p>
        <p className="mt-3 max-w-[31rem] text-2xl font-semibold leading-tight tracking-[-0.04em] text-[var(--text)]">
          O melhor stack é o que deixa a próxima mudança mais simples.
        </p>
      </div>
    </div>
  );
}

export default function MethodSection() {
  return (
    <motion.section
      id="method"
      className="border-b border-[var(--line)] bg-[#0a0a0a] scroll-mt-20"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.08 }}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-24 lg:px-8 lg:py-32">
        <motion.header variants={fadeInUp} className="flex flex-col justify-between gap-6 border-b border-white/[0.07] pb-9 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>03 / método &amp; stack</SectionKicker>
            <h2 className="heading-gradient mt-6 max-w-[10ch] text-[clamp(3.1rem,6vw,5.7rem)] font-semibold leading-[0.91] tracking-[-0.075em]">
              Escolher pela função.
            </h2>
          </div>
          <p className="max-w-[32rem] text-base leading-8 text-[var(--muted)] sm:text-[17px]">
            A tecnologia entra depois do problema. O método organiza o caminho para a entrega ser entendida, usada e mantida.
          </p>
        </motion.header>
        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-6">
          <motion.div variants={fadeInUp} className="contents">
            <WorkflowSpine />
            <StackBento />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
