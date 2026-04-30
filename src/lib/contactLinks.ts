export const email = "rodneifive34@gmail.com";

export const whatsappNumber = "5517988364203";

export const whatsappMessage =
  "Olá, Rodnei! Encontrei seu portfólio e gostaria de discutir uma demanda/projeto específico. Podemos conversar?";

export function buildWhatsAppHref(message = whatsappMessage) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const whatsappHref = buildWhatsAppHref();
