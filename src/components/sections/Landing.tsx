"use client";

import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";

const titles = site.heroTitles;
const longest = (list: string[]) => list.reduce((a, b) => (b.length > a.length ? b : a));

/** Slide classes for a stack of words: the current one sits in place, the previous one leaves upward. */
const roll = (i: number, current: number, count: number, instant = false) =>
  `transition-all ${instant ? "duration-0" : "duration-700"} ease-[cubic-bezier(.2,.7,.2,1)] ${
    i === current ? "translate-y-0 opacity-100" : i === (current + count - 1) % count ? "-translate-y-full opacity-0" : "translate-y-full opacity-0"
  }`;

/** Hero: name on the left, "A Creative <highlight> <role>" on the right, character in the middle. */
export function Landing() {
  const root = useRef<HTMLElement>(null);
  const { done } = useIntro();
  const [word, setWord] = useState(0);

  // Reveal the hero text and the fixed page chrome once the loader has gone.
  useGSAP(
    () => {
      if (!done) return;
      const reduced = document.documentElement.hasAttribute("data-reduced-motion") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hidden = document.querySelectorAll(".intro-hidden");
      const chrome = document.querySelectorAll("[data-site-header]");
      gsap.set(hidden, { autoAlpha: 1 });
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // Like the reference: the page chrome fades in while the character lights up,
      // then the right-hand words rise in letter by letter, then the name.
      const rise = { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.03 };
      const from = { yPercent: 105, opacity: 0, filter: "blur(6px)" };
      tl.fromTo(chrome, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, stagger: 0.05 }, 0.45)
        .fromTo("[data-split-r] [data-ch]", from, rise, 0.9)
        .fromTo("[data-word-r]", { yPercent: 40, opacity: 0, filter: "blur(6px)" }, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1 }, 1.0)
        .fromTo("[data-fade]", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.15)
        .fromTo("[data-split] span", from, rise, 1.2);
    },
    { scope: root, dependencies: [done] },
  );

  // Fade the hero text as the page scrolls on to About.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-hero-col]", { opacity: 1, y: 0 }, {
          immediateRender: false,
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Cycle the title: the purple word changes every time, the bottom word only when it differs.
  useEffect(() => {
    if (!done || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % titles.length), 2600);
    return () => clearInterval(id);
  }, [done]);

  // When two titles in a row share the bottom word, it swaps without moving.
  const sameRole = titles[word].role === titles[(word + titles.length - 1) % titles.length].role;

  const split = (text: string) =>
    text.split("").map((ch, i) => (
      <span key={i} data-ch className="inline-block whitespace-pre">
        {ch}
      </span>
    ));

  return (
    <section ref={root} id="hero" className="relative h-svh min-h-[34rem] overflow-hidden" aria-labelledby="hero-name">
      <div className="mx-auto flex h-full max-w-[1920px] flex-col justify-start px-6 pt-28 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:pt-0 lg:px-[6.5vw]">
        <div data-hero-col className="intro-hidden lg:mt-[6vh]">
          <p data-fade className="text-[clamp(1.25rem,1.6vw,1.9rem)] font-light text-accent">
            Hello! I&apos;m
          </p>
          <h1
            id="hero-name"
            aria-label={site.name}
            className="mt-1 text-[clamp(2.1rem,3.1vw,3.8rem)] leading-[0.98] font-semibold tracking-[0.01em] uppercase"
          >
            {site.heroName.map((line) => (
              <span key={line} data-split aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
                {split(line)}
              </span>
            ))}
          </h1>
        </div>

        <div data-hero-col className="intro-hidden mt-6 lg:mt-[6vh]">
          <p className="sr-only">
            A Creative {titles.map((t) => `${t.highlight} ${t.role}`).join(", ")}
          </p>
          <p data-split-r aria-hidden="true" className="overflow-hidden text-[clamp(1.1rem,1.55vw,1.85rem)] font-light text-accent">
            {split("A Creative")}
          </p>
          <p
            data-word-r
            aria-hidden="true"
            className="relative -mt-1 h-[0.82em] overflow-hidden text-[clamp(2.4rem,4.2vw,5rem)] leading-none font-bold whitespace-nowrap uppercase"
          >
            {titles.map((t, i) => (
              <span key={t.highlight} className={`text-glow-fill absolute top-0 left-0 block ${roll(i, word, titles.length)}`}>
                {t.highlight}
              </span>
            ))}
            <span className="invisible">{longest(titles.map((t) => t.highlight))}</span>
          </p>
          <p
            data-split-r
            aria-hidden="true"
            className="relative -mt-[0.3em] overflow-hidden pb-[0.05em] text-[clamp(1.9rem,2.9vw,3.5rem)] leading-none font-semibold whitespace-nowrap uppercase"
          >
            {titles.map((t, i) => (
              <span key={t.highlight} className={`absolute top-0 left-0 block ${roll(i, word, titles.length, sameRole)}`}>
                {split(t.role)}
              </span>
            ))}
            <span className="invisible">{longest(titles.map((t) => t.role))}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
