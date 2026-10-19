interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.25em] text-accent uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl"
      >
        {title}
      </h2>
    </div>
  );
}
