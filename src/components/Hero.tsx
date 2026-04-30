"use client";

import { BarChart3, ChevronRight, Code2, Database, Github, Linkedin, Mail, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "./motionPresets";
import WhatsAppIcon from "./WhatsAppIcon";
import { email, whatsappHref } from "@/lib/contactLinks";

const services = [
  {
    icon: Code2,
    title: "Sites & Frontend",
    copy: "Interfaces responsivas, rápidas e com leitura simples para o usuário final.",
  },
  {
    icon: BarChart3,
    title: "Dashboards & BI",
    copy: "Dados organizados em painéis claros para decisão comercial e financeira.",
  },
  {
    icon: Database,
    title: "Sistemas & ERPs",
    copy: "Arquitetura, regras de negócio e integrações para operação real.",
  },
  {
    icon: Workflow,
    title: "Automações",
    copy: "Fluxos que reduzem retrabalho, conectam ferramentas e ganham escala.",
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/rodneigk2", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rodnei-rodrigo-396396256", icon: Linkedin },
  { label: "WhatsApp", href: whatsappHref, icon: (props: React.ComponentProps<typeof WhatsAppIcon>) => <WhatsAppIcon {...props} className="text-white/70" /> },
  { label: "Email", href: `mailto:${email}`, icon: Mail },
];

export default function Hero() {
  return (
    <motion.section
      id="hero"
      className="section-shell glass-panel rounded-[2rem] p-6 sm:p-8 md:p-12 lg:min-h-[620px] lg:rounded-[3rem] lg:p-12 xl:p-14"
      variants={stagger}
      initial={false}
      animate="animate"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex max-w-5xl flex-col justify-center">
          <motion.span variants={fadeInUp} className="eyebrow">
            Fullstack architect
          </motion.span>

          <motion.div variants={fadeInUp} className="mt-6 max-w-5xl">
            <h1 className="hero-title font-bold">
              Sistemas, dashboards e automações com{" "}
              <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-strong)] to-white bg-clip-text text-transparent">
                cara de produto.
              </span>
            </h1>
            <p className="section-copy mt-6 max-w-2xl">
              Transformo problemas reais de negócio em software útil, bonito e confiável:
              ERPs, BIs, integrações e interfaces prontas para uso diário.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#projects" className="btn-gradient">
              Conhecer case MIRAI
              <ChevronRight size={18} />
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Pedir orçamento
              <WhatsAppIcon size={18} className="text-[var(--accent)]" />
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4 text-sm text-white/50">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="interactive-link inline-flex items-center gap-2"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div variants={fadeInUp} className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {services.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
          >
            <Icon className="text-[var(--accent)]" size={26} />
            <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-white/50">{copy}</p>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}


