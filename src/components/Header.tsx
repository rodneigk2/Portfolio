"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { navLinks, type AnchorId } from "@/lib/portfolioContent";
import { whatsappHref } from "@/lib/contactLinks";

function scrollToSection(href: AnchorId) {
  const target = document.querySelector<HTMLElement>(href);
  if (!target) return;

  const offset = window.innerWidth < 768 ? 92 : 104;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.pushState(null, "", href);
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<AnchorId>("#hero");

  useEffect(() => {
    const updateActiveSection = () => {
      const anchor = window.scrollY + window.innerHeight * 0.34;
      const current = navLinks.reduce<AnchorId>((active, link) => {
        const section = document.querySelector<HTMLElement>(link.href);
        return section && section.offsetTop <= anchor ? link.href : active;
      }, "#hero");

      setActiveHref(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, href: AnchorId) {
    event.preventDefault();
    setIsOpen(false);
    setActiveHref(href);
    scrollToSection(href);
  }

  return (
    <header className="sticky top-4 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="pill-nav mx-auto flex max-w-[1240px] items-center gap-3 px-3 py-2 sm:px-4">
        <a
          href="#hero"
          onClick={(event) => handleAnchorClick(event, "#hero")}
          aria-label="Rodnei Rodrigo, início"
          className="fade-link flex min-w-0 items-center gap-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/15 text-[11px] font-bold tracking-[-0.08em] text-[var(--accent)]">
            RR
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-[-0.02em]">Rodnei Rodrigo</span>
            <span className="label mt-1 block truncate text-[var(--quiet)]">produto · dados · IA</span>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleAnchorClick(event, link.href)}
              className={`label fade-link py-2 text-[var(--muted)] ${activeHref === link.href ? "text-[var(--accent)]" : ""}`}
              aria-current={activeHref === link.href ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 xl:flex">
          <span className="label inline-flex items-center gap-2 text-[var(--quiet)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(185,232,245,0.7)]" />
            disponível
          </span>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button primary-button !min-h-10 !rounded-full !px-4 !py-2.5 text-xs">
            Falar comigo
            <ArrowUpRight aria-hidden="true" size={15} className="shrink-0" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="button ghost-button ml-auto !h-10 !min-h-10 !w-10 !rounded-full !p-0 lg:hidden"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pill-nav mx-4 mt-3 overflow-hidden rounded-2xl p-4 sm:mx-6 lg:mx-8"
          >
            <nav aria-label="Navegação mobile" className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleAnchorClick(event, link.href)}
                  className="fade-link flex min-h-12 items-center justify-between py-4 label text-[var(--soft)]"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" size={15} className="arrow text-[var(--accent)]" />
                </a>
              ))}
            </nav>
            <div className="grid gap-2 pt-4 sm:grid-cols-2">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="button primary-button rounded-xl text-xs">
                Falar no WhatsApp
                <ArrowUpRight aria-hidden="true" size={15} className="arrow shrink-0" />
              </a>
              <a href="mailto:rodneifive34@gmail.com" className="button ghost-button rounded-xl text-xs">
                Enviar email
                <ArrowUpRight aria-hidden="true" size={15} className="arrow shrink-0" />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
