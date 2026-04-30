import type { Metadata } from "next";
import { Manrope, Sora, Space_Mono } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Rodnei Rodrigo | Fullstack, Dados e Produto",
  description:
    "Portfólio de Rodnei Rodrigo com sistemas, dashboards, ERPs, automações e integrações para transformar problemas reais de negócio em produto digital.",
  keywords: [
    "portfolio",
    "frontend",
    "javascript",
    "python",
    "postgresql",
    "redis",
    "dash",
    "plotly",
    "docker",
    "sites",
    "erp",
    "automacao",
  ],
  openGraph: {
    title: "Rodnei Rodrigo | Fullstack, Dados e Produto",
    description:
      "Sistemas, dashboards, ERPs e automações com arquitetura sólida, visual claro e resultado prático.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}


