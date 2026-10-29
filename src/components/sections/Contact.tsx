"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { site, navLinks } from "@/data/site";
import { SocialIcon, ArrowUpRight } from "@/components/ui/icons";

/** Redesigned footer — full-width, unique, animated. */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Big name fades + slides up
        gsap.fromTo(
          "[data-footer-name]",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: root.current, start: "top 80%" },
          },
        );
        // Stagger the info cards
        gsap.fromTo(
          "[data-footer-card]",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-footer-grid]", start: "top 85%" },
          },
        );
        // Bottom bar slides in
        gsap.fromTo(
          "[data-footer-bar]",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-footer-bar]", start: "top 95%" },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      id="footer"
      className="relative overflow-hidden border-t border-line"
      aria-labelledby="footer-title"
    >
      {/* Ambient glow blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-glow/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />

      <div className="mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-[6.5vw]">

        {/* ── Big name headline ──────────────────────────────────────── */}
        <div className="relative pt-20 pb-10 md:pt-28 md:pb-14">
          {/* Availability pill */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-bg/60 px-4 py-2 text-xs font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-accent">Available for projects</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{site.location}</span>
          </div>

          {/* Giant name — decorative */}
          <h2
            id="footer-title"
            data-footer-name
            className="select-none text-[clamp(3.2rem,9vw,9.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-text/10 uppercase"
            aria-label={site.name}
          >
            {site.heroName[0]}
            <br />
            <span className="text-glow-fill text-text/20">{site.heroName[1]}</span>
          </h2>

          {/* Role tag on the right */}
          <p className="absolute right-0 bottom-14 hidden text-right text-sm text-muted lg:block">
            {site.role}
          </p>
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />

        {/* ── Info grid ──────────────────────────────────────────────── */}
        <div
          data-footer-grid
          className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:py-16"
        >
          {/* Email */}
          <div data-footer-card className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Email</p>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-text transition-colors hover:text-accent md:text-base"
            >
              {site.email}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Location */}
          <div data-footer-card className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Location</p>
            <p className="text-sm font-medium text-text md:text-base">{site.location}</p>
            <p className="text-xs text-muted">GMT +6:00 · Available worldwide</p>
          </div>

          {/* Quick Nav */}
          <div data-footer-card className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Navigate</p>
            <ul className="space-y-2">
              {navLinks.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="group inline-flex items-center gap-1 text-sm font-medium text-text transition-colors hover:text-accent"
                  >
                    <span className="h-px w-3 bg-text/30 transition-all group-hover:w-5 group-hover:bg-accent" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div data-footer-card className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">Socials</p>
            <ul className="flex flex-col gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 text-sm font-medium text-text/70 transition-all hover:text-accent"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-text/5 transition-colors group-hover:border-accent/50 group-hover:bg-accent/10">
                      <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
                    </span>
                    {s.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />

        {/* ── Bottom bar ─────────────────────────────────────────────── */}
        <div
          data-footer-bar
          className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted sm:flex-row"
        >
          <p>
            © {year}{" "}
            <span className="font-medium text-text">{site.name}</span>
            {" "}· All rights reserved.
          </p>

          {/* Inline social icon strip */}
          <div className="flex items-center gap-3">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition-all hover:border-accent hover:text-accent hover:scale-110"
              >
                <SocialIcon name={s.icon} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>

          <p>
            Designed &amp; Developed by{" "}
            <a
              href={site.socials.find((s) => s.icon === "linkedin")?.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent transition-opacity hover:opacity-80"
            >
              {site.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
