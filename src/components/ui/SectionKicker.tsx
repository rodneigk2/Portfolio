import type { ReactNode } from "react";

type SectionKickerProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionKicker({ children, className = "" }: SectionKickerProps) {
  return (
    <span className={`label inline-flex items-center gap-3 text-[var(--accent)] ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-[var(--accent-strong)]" />
      {children}
    </span>
  );
}
