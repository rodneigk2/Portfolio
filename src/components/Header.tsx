"use client";

import {
  ArrowUpRight,
  BarChart3,
  Code2,
  Github,
  Home,
  Linkedin,
  Mail,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { whatsappHref } from "@/lib/contactLinks";

const navLinks = [
  { label: "Início", href: "#hero", icon: Home },
  { label: "Sobre", href: "#about", icon: Code2 },
  { label: "MIRAI", href: "#projects", icon: BarChart3 },
  { label: "Stack", href: "#skills", icon: Zap },
  { label: "Contato", href: "#contact", icon: Mail },
];

const socialLinks = [
  { label: "WhatsApp", href: whatsappHref, icon: WhatsAppIcon },
  { label: "GitHub", href: "https://github.com/rodneigk2", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rodnei-rodrigo-396396256",
    icon: Linkedin,
  },
];

function getScrollOffset() {
  return window.innerWidth < 1024 ? 92 : 24;
}

function easeInOutSine(progress: number) {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

function setProgrammaticScrollMode(isEnabled: boolean) {
  document.body.classList.toggle("is-programmatic-scrolling", isEnabled);
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(navLinks[0].href);
  const scrollAnimationRef = useRef<number | null>(null);
  const programmaticTargetRef = useRef<string | null>(null);
  const isScrolledRef = useRef(false);
  const sectionIds = useMemo(() => navLinks.map((link) => link.href.replace("#", "")), []);

  useEffect(() => {
    const onScroll = () => {
      const nextIsScrolled = window.scrollY > 24;

      if (isScrolledRef.current !== nextIsScrolled) {
        isScrolledRef.current = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id && !programmaticTargetRef.current) {
          setActiveSection(`#${visibleEntry.target.id}`);
        }
      },
      {
        root: null,
        rootMargin: "-28% 0px -52% 0px",
        threshold: [0.12, 0.28, 0.44, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const updateActiveFromScroll = () => {
      if (programmaticTargetRef.current) {
        return;
      }

      const viewportAnchor = window.scrollY + window.innerHeight * 0.36;
      const current = sectionIds.reduce((active, id) => {
        const section = document.getElementById(id);
        if (!section) return active;
        return section.offsetTop <= viewportAnchor ? `#${id}` : active;
      }, navLinks[0].href);

      setActiveSection(current);
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);

    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("resize", updateActiveFromScroll);
    };
  }, [sectionIds]);

  const smoothScrollTo = useCallback((target: HTMLElement, onComplete?: () => void) => {
    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
    }

    const start = window.scrollY;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const end = Math.max(0, Math.min(targetTop, maxScroll));
    const distance = Math.abs(end - start);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (distance < 8) {
      window.scrollTo(0, end);
      setProgrammaticScrollMode(false);
      onComplete?.();
      return;
    }

    setProgrammaticScrollMode(true);
    const duration = prefersReducedMotion ? 520 : Math.min(2600, Math.max(1200, distance * 0.95));
    const startedAt = performance.now();

    const step = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutSine(progress);

      window.scrollTo(0, start + (end - start) * eased);

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(step);
      } else {
        scrollAnimationRef.current = null;
        setProgrammaticScrollMode(false);
        onComplete?.();
      }
    };

    scrollAnimationRef.current = window.requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const cancelScrollAnimation = () => {
      programmaticTargetRef.current = null;
      setProgrammaticScrollMode(false);

      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
    };

    window.addEventListener("wheel", cancelScrollAnimation, { passive: true });
    window.addEventListener("touchstart", cancelScrollAnimation, { passive: true });
    window.addEventListener("keydown", cancelScrollAnimation);

    return () => {
      window.removeEventListener("wheel", cancelScrollAnimation);
      window.removeEventListener("touchstart", cancelScrollAnimation);
      window.removeEventListener("keydown", cancelScrollAnimation);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }

      setProgrammaticScrollMode(false);
    };
  }, []);

  useEffect(() => {
    const handleInternalAnchorClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      const href = anchor?.getAttribute("href");

      if (!anchor || !href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      setIsOpen(false);
      programmaticTargetRef.current = href;
      setActiveSection(href);
      smoothScrollTo(target, () => {
        programmaticTargetRef.current = null;
        setActiveSection(href);
        window.history.pushState(null, "", href);
      });
    };

    document.addEventListener("click", handleInternalAnchorClick, { capture: true });

    return () => document.removeEventListener("click", handleInternalAnchorClick, { capture: true });
  }, [smoothScrollTo]);

  return (
    <>
      <aside className="glass-panel desktop-sidebar hidden w-16 shrink-0 flex-col items-center rounded-[1.5rem] px-2 py-5 lg:flex">
        <nav className="flex flex-col items-center gap-5" aria-label="Navegação principal">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              title={label}
              aria-current={activeSection === href ? "page" : undefined}
              className={`action-icon group relative flex h-9 w-9 items-center justify-center rounded-xl ${
                activeSection === href ? "nav-item-active text-[var(--accent)]" : "text-white/40"
              }`}
            >
              <Icon size={18} />
              <span className="pointer-events-none absolute left-full ml-4 rounded-lg border border-white/10 bg-[#07111d]/90 px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/80 opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="action-icon flex h-9 w-9 items-center justify-center rounded-xl text-white/40"
            >
              <Icon size={17} />
            </a>
          ))}
        </div>
      </aside>

      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all lg:hidden ${
          isScrolled ? "pb-2" : "pb-0"
        }`}
      >
        <div className="glass-panel mx-auto flex h-16 max-w-3xl items-center justify-between rounded-2xl px-4">
          <a href="#hero" className="min-w-0">
            <p className="truncate font-display text-base font-bold">Rodnei Rodrigo</p>
            <p className="truncate text-xs text-white/50">Fullstack, dados e produto</p>
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="action-icon flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {isOpen && (
          <div className="glass-panel mx-auto mt-2 max-w-3xl rounded-2xl p-3">
            <nav className="grid gap-2">
              {navLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-current={activeSection === href ? "page" : undefined}
                  className={`interactive-card flex items-center justify-between rounded-xl border px-3 py-3 text-sm ${
                    activeSection === href
                      ? "border-[var(--accent)]/30 bg-[rgba(125,211,252,0.12)] text-white"
                      : "border-transparent text-white/70"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon size={17} />
                    {label}
                  </span>
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              className="btn-gradient mt-3 w-full"
            >
              Falar comigo
              <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </header>
    </>
  );
}


