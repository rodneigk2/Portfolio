"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { heroSpecs } from "@/lib/portfolioContent";
import { whatsappHref } from "@/lib/contactLinks";
import { fadeInUp, stagger } from "./motionPresets";
import SectionKicker from "./ui/SectionKicker";
import WindowBar from "./ui/WindowBar";
import WhatsAppIcon from "./WhatsAppIcon";

function HeroCopy() {
  return (
    <div>
      <motion.div variants={fadeInUp}>
        <SectionKicker>engenharia de produto · 2026</SectionKicker>
      </motion.div>
      <motion.h1
        variants={fadeInUp}
        className="heading-gradient mt-7 max-w-[11ch] text-[clamp(3.5rem,7vw,6.7rem)] font-semibold leading-[0.9] tracking-[-0.075em]"
      >
        Sistemas que deixam a operação <span className="text-[var(--accent)]">mais clara.</span>
      </motion.h1>
      <motion.p variants={fadeInUp} className="mt-8 max-w-[32rem] text-base leading-8 text-[var(--muted)] sm:text-[17px]">
        Transformo regras, dados e rotinas difíceis de organizar em produtos que uma equipe consegue usar, entender e manter.
      </motion.p>
      <motion.div variants={fadeInUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
        <a href="#mirai" className="button primary-button rounded-xl px-5 py-3.5">
          Ver o case MIRAI
          <ArrowUpRight aria-hidden="true" size={16} className="arrow shrink-0" />
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button ghost-button rounded-xl px-5 py-3.5">
          Falar sobre um projeto
          <WhatsAppIcon size={16} className="shrink-0" />
        </a>
      </motion.div>
      <motion.dl variants={fadeInUp} className="mt-14 grid max-w-[34rem] grid-cols-3 border-y border-[var(--line)] py-5">
        {heroSpecs.map((spec, index) => (
          <div key={spec.label} className={index > 0 ? "border-l border-[var(--line)] px-4" : "pr-4"}>
            <dt className="label text-[var(--quiet)]">{spec.label}</dt>
            <dd className="mt-2 text-sm font-semibold text-[var(--soft)]">{spec.value}</dd>
          </div>
        ))}
      </motion.dl>
    </div>
  );
}

function HeroMedia() {
  return (
    <motion.figure variants={fadeInUp} className="media-frame group p-3 sm:p-4">
      <WindowBar label="mirai / financeiro / dashboard" />
      <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[#030303]">
        <Image
          src="/projects/mirai/fluxo-caixa-desktop.jpeg"
          alt="Dashboard financeiro desktop do MIRAI"
          width={1400}
          height={800}
          priority
          quality={78}
          unoptimized
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.012]"
        />
      </div>
      <figcaption className="flex flex-col gap-3 px-1 pb-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="label text-[var(--quiet)]">fluxo de caixa / visão operacional</span>
        <a href="#mirai" className="label fade-link text-[var(--accent)]">
          abrir case <ArrowUpRight aria-hidden="true" size={13} className="arrow ml-1 inline-block" />
        </a>
      </figcaption>
    </motion.figure>
  );
}

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className="mx-auto grid min-h-[calc(100dvh-5rem)] max-w-[1240px] items-center gap-14 scroll-mt-28 px-6 pb-24 pt-24 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-8 lg:pb-32 lg:pt-32"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <HeroCopy />
      <HeroMedia />
    </motion.section>
  );
}
