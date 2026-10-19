/** "BS" monogram. Inherits the text colour. */
export function Logo({ className = "h-7 w-auto", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 44 30"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M4 26V4h8.5a5 5 0 0 1 0 10H4m8.5 0H14a6 6 0 0 1 0 12H4" />
      <path d="M39 7.5A5 5 0 0 0 34.5 4h-3a5 5 0 0 0 0 10h3a6 6 0 0 1 0 12h-3.5A5.5 5.5 0 0 1 25.5 22" />
    </svg>
  );
}
