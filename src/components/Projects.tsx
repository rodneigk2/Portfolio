"use client";

import { BarChart3, CheckCircle2, Maximize2, Play, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
  // Detecta se é mobile (user agent simples)
  const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
import { fadeInUp, stagger } from "./motionPresets";

const results = [
  "Arquitetura multi-tenant com isolamento de dados e configurações por empresa.",
  "Integração com bases Firebird legadas e PostgreSQL para centralizar operação.",
  "Fluxo de caixa com visão histórica, projeções e simulação what-if.",
  "Módulo de disparos via WhatsApp para marketing, cobrança e relacionamento.",
  "Inteligência central para reduzir inconsistências financeiras manuais.",
];

const modules = [
  "Vendas",
  "Orçamentos",
  "Despesas",
  "Recebimentos",
  "Fluxo de Caixa",
  "Relatórios",
  "Marketing",
  "Disparos",
  "Configurações",
];

const mobileShots = [
  { label: "Fluxo de Caixa", src: "/projects/mirai/mobile-fluxo-caixa.jpeg" },
  { label: "Menu lateral", src: "/projects/mirai/mobile-menu.jpeg" },
  { label: "Marketing", src: "/projects/mirai/mobile-marketing.jpeg" },
];

const previewImageSources = [
  "/projects/mirai/fluxo-caixa-desktop.jpeg",
  ...mobileShots.map((shot) => shot.src),
];

const stack = ["Python", "Dash", "Plotly", "PostgreSQL", "Firebird", "Redis", "Docker"];

type Preview =
  | { type: "video"; label: string }
  | { type: "image"; label: string; src: string; variant: "desktop" | "mobile" };

const desktopPreview: Preview = {
  type: "image",
  label: "Dashboard desktop",
  src: "/projects/mirai/fluxo-caixa-desktop.jpeg",
  variant: "desktop",
};

export default function Projects() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [activePreview, setActivePreview] = useState<Preview | null>(null);
  const [previewRequestId, setPreviewRequestId] = useState(0);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const preloadImages = () => {
      previewImageSources.forEach((src) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = src;
      });
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(preloadImages, { timeout: 2200 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(preloadImages, 1400);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!activePreview) return;

    const frame = window.requestAnimationFrame(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activePreview, previewRequestId]);

  function openPreview(preview: Preview) {
    setActivePreview(preview);
    setPreviewRequestId((value) => value + 1);
  }

  function openPreviewFullscreen() {
    const element = mediaRef.current;
    if (!element) return;

    const fullscreenElement = element as HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
      msRequestFullscreen?: () => Promise<void> | void;
    };

    if (fullscreenElement.requestFullscreen) {
      fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.webkitRequestFullscreen) {
      fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) {
      fullscreenElement.msRequestFullscreen();
    }
  }

  function exitPreviewFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <motion.section
      id="projects"
      variants={stagger}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.03, margin: "0px 0px -12% 0px" }}
    >
      <motion.div variants={fadeInUp} className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <div className="max-w-2xl">
          <span className="eyebrow">Projeto em destaque</span>
          <h2 className="section-title mt-5 font-bold">MIRAI - ERP & BI multi-tenant.</h2>
          <p className="section-copy mt-5">
            Um produto em produção para gestão comercial e financeira, com dashboards, automações
            e regras de negócio organizadas em uma experiência clara.
          </p>

          <div className="mt-8 grid gap-3">
            {results.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={19} />
                  <p className="text-sm leading-6 text-white/70">{item}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Módulos em produção
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {modules.map((item) => (
                <span
                  key={item}
                  className={`tag-chip ${item === "Disparos" ? "!border-[var(--accent-warm)] !text-[var(--accent-warm)]" : ""}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openPreview({ type: "video", label: "Vídeo demo" })}
              className="btn-gradient"
            >
              <Play size={18} />
              Assistir demo
            </button>
            <button type="button" onClick={() => openPreview(desktopPreview)} className="btn-outline">
              <Maximize2 size={18} />
              Explorar telas
            </button>
          </div>
        </div>

        <div className="screen-frame rounded-[2rem] p-3 sm:p-4 lg:rounded-[2.5rem]">
          <div className="flex flex-col gap-3 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                Telas do produto
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
                <BarChart3 size={15} className="text-[var(--accent)]" />
                Clique em uma tela para ver em detalhe
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--accent)]">
              <ShieldCheck size={13} />
              case real
            </span>
          </div>

          <button
            type="button"
            onClick={() => openPreview(desktopPreview)}
            className="media-tile group mt-4 block w-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/40 text-left"
          >
            <Image
              src="/projects/mirai/fluxo-caixa-desktop.jpeg"
              alt="Dashboard desktop do MIRAI"
              width={1400}
              height={800}
              loading="lazy"
              quality={72}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 88vw, 48vw"
              className="h-auto w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.015]"
            />
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {mobileShots.map((shot) => (
              <button
                key={shot.label}
                type="button"
                onClick={() =>
                  openPreview({
                    type: "image",
                    label: shot.label,
                    src: shot.src,
                    variant: "mobile",
                  })
                }
                className="media-tile group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-left"
                aria-label={`Ver tela mobile do MIRAI - ${shot.label}`}
              >
                <div className="overflow-hidden rounded-xl bg-black/30">
                  <Image
                    src={shot.src}
                    alt={`Tela mobile do MIRAI - ${shot.label}`}
                    width={320}
                    height={640}
                    loading="lazy"
                    quality={68}
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 28vw, 14vw"
                    className="h-52 w-full object-cover object-top transition-transform duration-1000 ease-out group-hover:scale-[1.025] sm:h-64"
                  />
                </div>
                <p className="px-1 pt-3 text-center font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/60">
                  {shot.label}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="tag-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {activePreview && (
        <div
          id="mirai-preview"
          data-preview-panel="true"
          ref={previewRef}
          className="mt-10 scroll-mt-24 rounded-[2rem] border border-[var(--accent)]/25 bg-black/25 p-3 shadow-[0_24px_80px_rgba(56,189,248,0.12)] sm:p-4 lg:rounded-[2.5rem] lg:p-5"
        >
          <div className="mb-4 flex flex-col gap-3 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
                Visualização do MIRAI
              </p>
              <p className="mt-1 text-sm text-white/70">{activePreview.label}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openPreview({ type: "video", label: "Vídeo demo" })}
                className={`tag-chip ${activePreview.type === "video" ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}
              >
                Vídeo
              </button>
              <button
                type="button"
                onClick={() => openPreview(desktopPreview)}
                className={`tag-chip ${activePreview.type === "image" && activePreview.variant === "desktop" ? "!border-[var(--accent)] !text-[var(--accent)]" : ""}`}
              >
                Desktop
              </button>
            </div>
          </div>

          <div
            ref={mediaRef}
            className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/45"
          >
            {activePreview.type === "image" && !isMobile && (
              <>
                {!isFullscreen ? (
                  <button
                    type="button"
                    onClick={openPreviewFullscreen}
                    className="action-icon absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-xs font-bold text-white/80 backdrop-blur-md"
                    aria-label="Abrir visualização em tela cheia"
                  >
                    <Maximize2 size={15} />
                    Tela cheia
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={exitPreviewFullscreen}
                    className="action-icon absolute right-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-xs font-bold text-white/80 backdrop-blur-md"
                    aria-label="Sair do modo tela cheia"
                  >
                    ✕
                    Sair tela cheia
                  </button>
                )}
              </>
            )}
            {activePreview.type === "video" ? (
              <video
                key="mirai-demo"
                src="/projects/mirai/mirai-demo.mp4"
                poster="/projects/mirai/fluxo-caixa-desktop.jpeg"
                controls
                preload="none"
                playsInline
                controlsList="nodownload"
                className="max-h-[78vh] w-full bg-black"
              />
            ) : (
              <div className={activePreview.variant === "mobile" ? "flex w-full justify-center p-4" : "w-full"}>
                <Image
                  key={activePreview.src}
                  src={activePreview.src}
                  alt={`Visualização do MIRAI - ${activePreview.label}`}
                  width={activePreview.variant === "desktop" ? 1400 : 600}
                  height={activePreview.variant === "desktop" ? 800 : 1200}
                  loading="lazy"
                  quality={activePreview.variant === "desktop" ? 74 : 70}
                  unoptimized
                  sizes={activePreview.variant === "desktop" ? "min(100vw, 1200px)" : "(max-width: 768px) 78vw, 420px"}
                  className={
                    activePreview.variant === "desktop"
                      ? "h-auto w-full object-contain"
                    : "max-h-[78vh] w-auto rounded-2xl object-contain"
                }
              />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
}

