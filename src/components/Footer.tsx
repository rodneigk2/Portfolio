import { ArrowUpRight } from "lucide-react";

const links = [
  { label: "GitHub", href: "https://github.com/rodneigk2" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rodnei-rodrigo-396396256" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">Rodnei Rodrigo</p>
          <p className="label mt-2 text-[var(--quiet)]">produtos operacionais / dados / IA</p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="label fade-link text-[var(--quiet)]">
              {link.label}
            </a>
          ))}
          <a href="#hero" className="label fade-link text-[var(--quiet)]">
            Topo <ArrowUpRight aria-hidden="true" size={13} className="arrow ml-1 inline-block" />
          </a>
        </div>
      </div>
    </footer>
  );
}
