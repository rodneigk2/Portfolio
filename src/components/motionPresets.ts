
import { easeOut } from "framer-motion";

export const fadeInUp = {
  initial: { opacity: 0.08, y: 18, scale: 0.992 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.52, ease: easeOut } },
};


export const fadeIn = {
  initial: { opacity: 0.08 },
  animate: { opacity: 1, transition: { duration: 0.52, ease: easeOut } },
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

