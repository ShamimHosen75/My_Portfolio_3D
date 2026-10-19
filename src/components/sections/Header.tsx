"use client";

import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/icons";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { navLinks, site } from "@/data/site";

export function Header() {
  const { scrollTo } = useSmoothScroll();
  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <>
      <header data-site-header className="intro-hidden fixed inset-x-0 top-0 z-50 px-5 sm:px-8 lg:px-10">
        <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4 md:h-20">
          <a href="#hero" onClick={go("hero")} aria-label="Billal Hosen Shamim, back to top" className="text-text">
            <Logo className="h-6 w-auto md:h-7" />
          </a>
          <a
            href={`mailto:${site.email}`}
            className="absolute left-1/2 hidden -translate-x-1/2 text-sm font-medium tracking-wide text-text transition-colors hover:text-accent md:block"
          >
            {site.email}
          </a>
          <ul className="flex items-center gap-5 sm:gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  className="text-xs font-semibold tracking-[0.12em] text-text uppercase transition-colors hover:text-accent sm:text-[13px]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Fixed social icons (bottom left) and resume link (bottom right), desktop only */}
      <div data-site-header className="intro-hidden fixed bottom-6 left-5 z-40 hidden flex-col gap-5 md:flex lg:left-10">
        {site.socials.slice(0, 3).map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} (opens in a new tab)`}
            className="text-text transition-colors hover:text-accent"
          >
            <SocialIcon name={s.icon} />
          </a>
        ))}
      </div>
      <a
        data-site-header
        href={site.resume}
        target="_blank"
        rel="noopener"
        className="intro-hidden fixed right-5 bottom-6 z-40 hidden items-center gap-2 text-sm font-medium tracking-[0.35em] text-muted transition-colors hover:text-text md:flex lg:right-10"
      >
        RESUME
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4" strokeLinejoin="round" />
        </svg>
      </a>
    </>
  );
}
