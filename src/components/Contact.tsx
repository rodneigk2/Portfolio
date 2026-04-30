"use client";

import { Check, Copy, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "./motionPresets";
import WhatsAppIcon from "./WhatsAppIcon";
import { email, whatsappHref } from "@/lib/contactLinks";

const notes = [
  "SaaS e sistemas internos",
  "Dashboards e BI",
  "ERPs sob medida",
  "Integrações e APIs",
  "Automações de processo",
  "Interfaces operacionais",
];

const contactFlow = [
  {
    title: "Briefing rápido",
    copy: "Você manda o contexto no WhatsApp e eu já devolvo as primeiras perguntas certas.",
  },
  {
    title: "Escopo claro",
    copy: "Organizo prioridade, telas, integrações e o caminho mais simples para tirar do papel.",
  },
  {
    title: "Próximo passo",
    copy: "Se fizer sentido, seguimos para proposta, prazo e formato de entrega.",
  },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section id="contact" className="section-shell glass-panel rounded-[2rem] p-6 sm:p-8 lg:rounded-[3rem] lg:p-12 xl:p-16">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.03, margin: "0px 0px -12% 0px" }}
        variants={fadeInUp}
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Contato</span>
          <h2 className="section-title mt-5 font-bold">Vamos conversar pelo WhatsApp?</h2>
          <p className="section-copy mt-5">
            O caminho principal é direto: clique, abra a mensagem pronta e me conte o contexto
            inicial no WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[var(--accent)]/25 bg-[rgba(125,211,252,0.1)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 text-[var(--accent)]">
              <WhatsAppIcon size={24} className="text-zinc-400" />
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em]">
                Contato principal
              </p>
            </div>

            <h3 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
              WhatsApp direto para orçamento, briefing e alinhamento.
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
              A mensagem já vai pronta para abrir conversa. Depois disso, você só completa com o
              problema, ideia ou sistema que quer construir.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient w-full sm:w-auto"
              >
                <WhatsAppIcon size={18} className="text-zinc-400" />
                Falar no WhatsApp
              </a>
              <a href={`mailto:${email}`} className="btn-outline w-full sm:w-auto">
                <Mail size={18} />
                Usar email
              </a>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {contactFlow.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="font-display text-lg font-bold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/55">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-[var(--accent)]">
                <MapPin size={20} />
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em]">
                  Disponibilidade
                </p>
              </div>
              <p className="mt-4 font-display text-2xl font-bold">Remoto / Brasil (GMT-3)</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {notes.map((item) => (
                  <span key={item} className="tag-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 text-[var(--accent)]">
                <Mail size={20} />
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em]">
                  E-mail profissional
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <p className="break-all font-display text-2xl font-bold text-[var(--accent)]">{email}</p>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="action-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white/70"
                  title="Copiar email"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="https://github.com/rodneigk2"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Github size={18} />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/rodnei-rodrigo-396396256"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            </div>

            <div className="rounded-[2rem] border border-[var(--accent)]/18 bg-[var(--accent)]/10 p-6">
              <div className="flex items-center gap-3 text-[var(--accent)]">
                <Sparkles size={18} />
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em]">
                  Direção certa
                </p>
              </div>
              <p className="mt-4 text-base leading-7 text-white/70">
                Traga o problema, o fluxo ou a ideia. Eu ajudo a transformar em estrutura,
                interface e entrega prática.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
