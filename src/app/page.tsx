import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <div className="app-shell">
      <Header />
      <div className="content-shell">
        <div className="glass-panel hidden h-24 items-center justify-between rounded-[2rem] px-8 lg:flex">
          <div>
            <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.25em] text-white/40">
              Desenvolvedor
            </p>
            <p className="mt-1 font-display text-xl font-bold">
              Rodnei Rodrigo - Fullstack, Dados e Produto
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              Disponível para projetos
            </span>
            <a href="#contact" className="btn-gradient !px-5 !py-2.5">
              Falar comigo
            </a>
          </div>
        </div>
        <main className="relative z-10 flex flex-col gap-6">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}


