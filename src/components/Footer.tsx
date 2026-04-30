import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { email, whatsappHref } from "@/lib/contactLinks";

const links = [
  { label: "WhatsApp", href: whatsappHref, icon: WhatsAppIcon },
  { label: "GitHub", href: "https://github.com/rodneigk2", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rodnei-rodrigo-396396256", icon: Linkedin },
  { label: "Email", href: `mailto:${email}`, icon: Mail },
];

export default function Footer() {
  return (
    <footer className="glass-panel rounded-[2rem] p-6 text-center lg:rounded-[3rem] lg:p-9 lg:text-left">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl font-bold">Rodnei Rodrigo</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
            Sistemas, dashboards, ERPs e automações sob demanda com custo-benefício,
            acabamento e resultado prático.
          </p>
          <p className="mt-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--accent)]">
            Fullstack - Dados - Produto
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="btn-outline !px-4 !py-3"
            >
              <Icon size={16} className={label === "WhatsApp" ? "text-white/70" : undefined} />
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Rodnei Rodrigo. Todos os direitos reservados.</p>
        <a href="#hero" className="interactive-link inline-flex items-center justify-center gap-2">
          Voltar ao topo
          <ArrowUpRight size={15} />
        </a>
      </div>
    </footer>
  );
}
