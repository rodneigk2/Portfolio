export type AnchorId = "#hero" | "#mirai" | "#aep" | "#method" | "#contact";

export type NavLink = {
  label: string;
  href: AnchorId;
};

export type MediaAsset = {
  label: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type MiraiFact = {
  label: string;
  text: string;
};

export type AepRow = {
  number: string;
  action: string;
  response: string;
};

export type WorkflowStep = {
  number: string;
  phase: string;
  title: string;
  text: string;
};

export type StackGroup = {
  label: string;
  value: string;
};

export const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "MIRAI", href: "#mirai" },
  { label: "AEP", href: "#aep" },
  { label: "Método", href: "#method" },
  { label: "Contato", href: "#contact" },
] as const satisfies readonly NavLink[];

export const heroSpecs = [
  { label: "case ativo", value: "MIRAI" },
  { label: "camada", value: "Dash + dados" },
  { label: "base", value: "PostgreSQL" },
] as const;

export const miraiFacts = [
  {
    label: "resultado",
    text: "Leitura histórica, projeções e simulação em um único fluxo.",
  },
  {
    label: "operação",
    text: "Cobranças, relacionamento e acompanhamento comercial organizados.",
  },
  {
    label: "base",
    text: "Legado, PostgreSQL e regras de negócio sem esconder a complexidade.",
  },
] as const satisfies readonly MiraiFact[];

export const miraiStack = "Python · Dash · Plotly · PostgreSQL · Firebird · Redis · Docker";

export const mobileShots = [
  {
    label: "fluxo de caixa",
    src: "/projects/mirai/mobile-fluxo-caixa.jpeg",
    alt: "Tela mobile de fluxo de caixa do MIRAI",
    width: 320,
    height: 640,
  },
  {
    label: "menu operacional",
    src: "/projects/mirai/mobile-menu.jpeg",
    alt: "Tela mobile do menu operacional do MIRAI",
    width: 320,
    height: 640,
  },
  {
    label: "marketing",
    src: "/projects/mirai/mobile-marketing.jpeg",
    alt: "Tela mobile de marketing do MIRAI",
    width: 320,
    height: 640,
  },
] as const satisfies readonly MediaAsset[];

export const aepRows = [
  {
    number: "01",
    action: "Alterar arquivo",
    response: "Classifica risco antes de tocar no código.",
  },
  {
    number: "02",
    action: "Carregar contexto",
    response: "Entrega só o que a rota precisa saber.",
  },
  {
    number: "03",
    action: "Chamar ferramenta",
    response: "Seleciona capacidade e permissão antes do uso.",
  },
  {
    number: "04",
    action: "Declarar término",
    response: "Exige validação e evidência antes da entrega.",
  },
  {
    number: "05",
    action: "Publicar resultado",
    response: "Declara limites e risco residual sem prometer demais.",
  },
] as const satisfies readonly AepRow[];

export const workflowSteps = [
  {
    number: "01",
    phase: "descobrir",
    title: "Mapear o fluxo real",
    text: "Entender rotina, regra e decisão antes de desenhar tela.",
  },
  {
    number: "02",
    phase: "escolher",
    title: "Tecnologia por função",
    text: "A stack serve o problema, não o contrário.",
  },
  {
    number: "03",
    phase: "construir",
    title: "Base pronta para crescer",
    text: "Dados, integrações e regras organizados para a próxima fase.",
  },
  {
    number: "04",
    phase: "entregar",
    title: "Acabamento de produto",
    text: "A interface precisa passar confiança no uso diário.",
  },
] as const satisfies readonly WorkflowStep[];

export const stackGroups = [
  { label: "frontend", value: "React · Next.js · TypeScript · Tailwind" },
  { label: "dados", value: "Python · PostgreSQL · Redis · SQL" },
  { label: "operação", value: "Dash · Plotly · APIs · integrações legadas" },
  { label: "automação", value: "Agentes · gates · traces · validação" },
] as const satisfies readonly StackGroup[];
