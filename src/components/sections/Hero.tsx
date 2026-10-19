"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { useIntro } from "@/components/providers/IntroProvider";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/data/site";

export function Hero() {
  const { done } = useIntro();
  const { scrollTo } = useSmoothScroll();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const played = useRef(false);

  // Letter-by-letter headline, once, after the preloader is gone.
  useGSAP(
    () => {
      if (!done || played.current || !titleRef.current) return;
      played.current = true;
      const letters = titleRef.current.querySelectorAll(".hero-letter");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          letters,
          { yPercent: 110, rotate: 6, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.035,
          },
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(letters, { opacity: 1 });
      });
    },
    { dependencies: [done] },
  );

  const words = site.name.split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-28 pb-16 sm:px-8"
    >
      {/* Soft accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-20%] h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl">
        {site.openToWork && (
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm font-medium text-text">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            Open to work
          </p>
        )}

        <h1
          id="hero-title"
          ref={titleRef}
          aria-label={site.name}
          className="mt-8 font-display text-[clamp(3rem,12.5vw,9.75rem)] leading-[0.88] font-extrabold tracking-[-0.045em]"
        >
          {words.map((word, w) => (
            <span
              key={w}
              aria-hidden="true"
              className="mr-[0.2em] inline-block overflow-hidden pb-[0.06em] align-top last:mr-0"
            >
              {word.split("").map((char, i) => (
                <span
                  key={i}
                  className="hero-letter inline-block will-change-transform"
                >
                  {char}
                </span>
              ))}
              {w === words.length - 1 && <span className="text-accent">.</span>}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-start">
          <p className="max-w-xl text-2xl leading-tight font-semibold text-text sm:text-3xl">
            {site.tagline}
          </p>
          <div>
            <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {site.intro[0]}
              <br className="hidden sm:block" /> {site.intro[1]}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.resume}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3.5 font-semibold transition-colors hover:border-accent"
              >
                Resume
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 20h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-bg transition-transform hover:-translate-y-0.5"
              >
                Get in touch
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
