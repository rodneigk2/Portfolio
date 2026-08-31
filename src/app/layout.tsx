import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

const monoFont = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Rodnei Rodrigo | Engenharia de produto, dados e IA",
  description:
    "Portfólio de Rodnei Rodrigo: produtos operacionais, dashboards, sistemas e infraestrutura para agentes de IA.",
  keywords: [
    "portfolio",
    "engenharia de produto",
    "ia engineer",
    "engenheiro de IA",
    "react",
    "next.js",
    "typescript",
    "dashboards",
    "erp",
    "automacao",
    "agentes de IA",
  ],
  openGraph: {
    title: "Rodnei Rodrigo | Engenharia de produto, dados e IA",
    description:
      "Sistemas, dashboards e infraestrutura para agentes de IA com clareza operacional e base técnica.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
