"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { miraiFacts, miraiStack, mobileShots } from "@/lib/portfolioContent";
import { fadeInUp, stagger } from "./motionPresets";
import SectionKicker from "./ui/SectionKicker";
import WindowBar from "./ui/WindowBar";

const desktopImage = {
  src: "/projects/mirai/fluxo-caixa-desktop.jpeg",
  alt: "Tela principal do dashboard financeiro MIRAI",
};

function MiraiBrief() {
  return (
    <div className="lg:sticky lg:top-28 lg:col-span-4">
      <div className="border-l-2 border-[var(--accent-strong)] pl-5">
        <p className="label text-[var(--accent)]">o problema</p>
        <p className="mt-3 max-w-[18rem] text-2xl font-semibold leading-tight tracking-[-0.04em] text-[var(--text)]">
          Clareza para decidir. Base para crescer.
        </p>
      </div>
      <dl className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {miraiFacts.map((fact) => (
          <div key={fact.label} className="grid grid-cols-[5.4rem_1fr] gap-4 py-5">
            <dt className="label text-[var(--quiet)]">{fact.label}</dt>
            <dd className="text-sm leading-6 text-[var(--soft)]">{fact.text}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 border-t border-white/[0.07] pt-5">
        <p className="label text-[var(--quiet)]">stack do case</p>
        <p className="mt-3 text-sm leading-7 text-[var(--soft)]">{miraiStack}</p>
      </div>
    </div>
  );
}

function MiraiMedia() {
  return (
    <figure className="media-frame p-3 sm:p-4">
      <WindowBar label="mirai / financeiro / diagnóstico" />
      <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[#030303]">
        <Image
          src={desktopImage.src}
          alt={desktopImage.alt}
          width={1400}
          height={800}
          quality={78}
          unoptimized
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="flex flex-col gap-2 px-1 pb-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="label text-[var(--quiet)]">tela principal / diagnóstico, saldo e projeção</span>
        <span className="label text-[var(--accent)]">interface real · 01</span>
      </figcaption>
    </figure>
  );
}

function MobileViews() {
  return (
    <div className="mt-14 border-t border-white/[0.07] pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="label text-[var(--accent)]">material de apoio</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
            Fluxos mobile, sem esconder a tela principal.
          </h3>
        </div>
        <span className="label hidden text-[var(--quiet)] sm:block">03 views</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {mobileShots.map((shot) => (
          <figure key={shot.label} className="group min-w-0">
            <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#030303] transition duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:border-white/[0.15]">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                quality={72}
                unoptimized
                sizes="(max-width: 640px) 100vw, 20vw"
                className="h-72 w-full object-cover object-top"
              />
            </div>
            <figcaption className="label mt-3 text-[var(--quiet)]">{shot.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function MiraiCase() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDemoOpen) return;

    const frame = window.requestAnimationFrame(() => {
      demoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isDemoOpen]);

  return (
    <motion.section
      id="mirai"
      className="border-y border-[var(--line)] bg-[#030303] scroll-mt-20"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.08 }}
    >
      <div className="mx-auto max-w-[1240px] px-6 py-24 lg:px-8 lg:py-32">
        <motion.header variants={fadeInUp} className="flex flex-col justify-between gap-6 border-b border-white/[0.07] pb-9 lg:flex-row lg:items-end">
          <div>
            <SectionKicker>01 / case study</SectionKicker>
            <h2 className="heading-gradient mt-6 max-w-[11ch] text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.075em]">
              MIRAI, financeiro sem ruído.
            </h2>
          </div>
          <p className="max-w-[31rem] text-base leading-8 text-[var(--muted)] sm:text-[17px]">
            Uma interface para ler o caixa, enxergar risco e acompanhar a operação sem transformar o dado em mais uma barreira.
          </p>
        </motion.header>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div variants={fadeInUp} className="lg:col-span-4">
            <MiraiBrief />
          </motion.div>

          <motion.div variants={fadeInUp} className="min-w-0 lg:col-span-8">
            <MiraiMedia />
            <div className="flex flex-col gap-4 border-b border-white/[0.07] py-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[32rem] text-sm leading-6 text-[var(--muted)]">
                A prova fica no centro da narrativa: uma tela real, um contexto real e uma ação que abre o demo sem abandonar o case.
              </p>
              <button
                type="button"
                onClick={() => setIsDemoOpen((value) => !value)}
                className="button ghost-button shrink-0 rounded-xl text-[var(--accent)]"
                aria-expanded={isDemoOpen}
                aria-controls="mirai-demo-panel"
              >
                <Play aria-hidden="true" size={15} />
                {isDemoOpen ? "Fechar demo" : "Assistir demo"}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {isDemoOpen ? (
                <motion.div
                  id="mirai-demo-panel"
                  ref={demoRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="demo-panel bento-surface mt-6 rounded-2xl p-3"
                >
                  <video
                    aria-label="Demo em vídeo do MIRAI"
                    className="w-full rounded-xl bg-black"
                    controls
                    controlsList="nodownload"
                    playsInline
                    poster="/projects/mirai/fluxo-caixa-desktop.jpeg"
                    preload="metadata"
                    src="/projects/mirai/mirai-demo.mp4"
                  />
                  <p className="label mt-3 px-1 text-[var(--quiet)]">demo do MIRAI / fluxo de caixa em uso</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <MobileViews />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
