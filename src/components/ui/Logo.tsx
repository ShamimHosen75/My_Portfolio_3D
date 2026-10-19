interface LogoProps {
  className?: string;
  title?: string;
}

/** Isometric cube mark, a nod to the Rubik's cube intro. */
export function LogoMark({ className, title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <polygon points="16,2.5 28.5,9.5 16,16.5 3.5,9.5" fill="#F2A541" />
      <polygon points="3.5,9.5 16,16.5 16,30 3.5,23" fill="#C77F24" />
      <polygon points="28.5,9.5 16,16.5 16,30 28.5,23" fill="#F7C77A" />
      <path
        d="M16 16.5V30M3.5 9.5 16 16.5l12.5-7"
        stroke="#0F2A30"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8" />
      <span className="text-lg font-bold tracking-tight">
        Shamim<span className="text-accent">.</span>
      </span>
    </span>
  );
}
