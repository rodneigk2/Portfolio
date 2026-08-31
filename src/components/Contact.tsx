"use client";

import { Check, Copy, Mail, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { email, whatsappHref } from "@/lib/contactLinks";
import { fadeInUp } from "./motionPresets";
import SectionKicker from "./ui/SectionKicker";
import WhatsAppIcon from "./WhatsAppIcon";
import { motion } from "framer-motion";

type CopyState = "idle" | "success" | "error";

function copyWithFallback(value: string) {
  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.left = "-9999px";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand("copy");
  helper.remove();

  if (!copied) throw new Error("Clipboard fallback failed");
}

export default function Contact() {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyEmail() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        copyWithFallback(email);
      }
      setCopyState("success");
    } catch {
      try {
        copyWithFallback(email);
        setCopyState("success");
      } catch {
        setCopyState("error");
      }
    }

    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState("idle"), 1800);
  }

  const copyLabel = copyState === "success" ? "Copiado" : copyState === "error" ? "Tentar novamente" : "Copiar";

  return (
    <motion.section
      id="contact"
      className="bg-black scroll-mt-20"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.08 }}
      variants={fadeInUp}
    >
      <div className="mx-auto grid max-w-[1240px] gap-14 px-6 py-24 lg:grid-cols-12 lg:gap-20 lg:px-8 lg:py-32">
        <div className="lg:col-span-6">
          <SectionKicker>04 / próximo passo</SectionKicker>
          <h2 className="heading-gradient mt-6 max-w-[9ch] text-[clamp(3.7rem,7vw,7rem)] font-semibold leading-[0.86] tracking-[-0.08em]">
            Vamos começar pelo contexto.
          </h2>
          <p className="mt-8 max-w-[29rem] text-base leading-8 text-[var(--muted)] sm:text-[17px]">
            Mande o problema. Eu devolvo as primeiras perguntas certas e um caminho claro para começar.
          </p>
          <dl className="mt-10 grid max-w-[29rem] grid-cols-2 border-y border-white/[0.07] py-5">
            <div className="pr-5">
              <dt className="label text-[var(--quiet)]">atuação</dt>
              <dd className="mt-2 text-sm font-semibold text-[var(--soft)]">Remoto / Brasil</dd>
            </div>
            <div className="border-l border-white/[0.07] pl-5">
              <dt className="label text-[var(--quiet)]">janela</dt>
              <dd className="mt-2 text-sm font-semibold text-[var(--soft)]">GMT-3 · direto</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="border-t border-white/[0.07]">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="direct-link group flex min-h-28 items-start justify-between gap-5 border-b border-white/[0.07] py-7">
              <span>
                <span className="label block text-[var(--accent)]">canal 01 / contexto rápido</span>
                <span className="mt-3 block text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Falar pelo WhatsApp</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={22} className="arrow mt-1 shrink-0 text-[var(--accent)]" />
            </a>
            <a href={`mailto:${email}`} className="direct-link group flex min-h-32 items-start justify-between gap-5 border-b border-white/[0.07] py-7">
              <span>
                <span className="label block text-[var(--accent)]">canal 02 / escopo e referências</span>
                <span className="mt-3 block text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">Escrever por email</span>
                <span className="mt-2 block break-all text-sm text-[var(--muted)]">{email}</span>
              </span>
              <ArrowUpRight aria-hidden="true" size={22} className="arrow mt-1 shrink-0 text-[var(--accent)]" />
            </a>
          </div>

          <div className="bento-surface mt-7 flex flex-col justify-between gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="label text-[var(--quiet)]">email direto</p>
              <p className="mt-2 break-all text-sm text-[var(--soft)]">{email}</p>
            </div>
            <button
              type="button"
              onClick={copyEmail}
              className={`button ghost-button shrink-0 rounded-xl px-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${copyState === "error" ? "copy-error" : "text-[var(--soft)]"}`}
              aria-label={`${copyLabel} email`}
            >
              {copyState === "success" ? <Check aria-hidden="true" size={15} /> : copyState === "error" ? <Copy aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={15} />}
              <span aria-live="polite">{copyLabel}</span>
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[var(--quiet)]">
            <Mail aria-hidden="true" size={15} />
            <span className="label">resposta direta, sem formulário genérico</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
