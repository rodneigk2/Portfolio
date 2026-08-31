type WindowBarProps = {
  label: string;
  status?: string;
};

export default function WindowBar({ label, status = "interface real" }: WindowBarProps) {
  return (
    <div className="window-bar flex min-w-0 items-center justify-between gap-4 px-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="h-2 w-2 rounded-full bg-zinc-800" />
        </span>
        <span className="label min-w-0 truncate text-[var(--quiet)]">{label}</span>
      </div>
      {status ? (
        <span className="label hidden shrink-0 items-center gap-2 text-[var(--accent)] sm:inline-flex">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          {status}
        </span>
      ) : null}
    </div>
  );
}
