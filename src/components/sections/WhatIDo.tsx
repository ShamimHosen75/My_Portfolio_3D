"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { whatIDo } from "@/data/about";

/** "What I do": huge heading on the left, the character at the desk, accordion cards on the right. */
export function WhatIDo() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 45%", toggleActions: "play none none reverse" },
        });
        tl.fromTo("[data-wid-line]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, 0)
          .fromTo("[data-card] .corner", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "back.out(2)" }, 0.15)
          .fromTo(
            "[data-card-border]",
            { clipPath: "inset(0 100% 100% 0)" },
            { clipPath: "inset(0 0% 0% 0)", duration: 0.9, stagger: 0.15, ease: "power2.inOut" },
            0.3,
          )
          .fromTo("[data-card-body]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, 0.8);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="what-i-do" className="relative min-h-svh" aria-labelledby="what-i-do-title">
      <div className="mx-auto flex min-h-svh max-w-[1920px] flex-col justify-end gap-10 px-6 pt-24 pb-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:py-24 lg:px-[6.5vw]">
        <h2
          id="what-i-do-title"
          className="text-[clamp(3.2rem,6.2vw,7.5rem)] leading-[0.9] font-semibold tracking-tight uppercase lg:mt-[28vh] lg:self-center"
        >
          <span data-wid-line className="block">What</span>
          <span data-wid-line className="block text-accent">
            <span className="text-text">I</span> Do
          </span>
        </h2>

        <div className="flex w-full flex-col lg:w-[clamp(18rem,25vw,26rem)]">
          {whatIDo.map((card, i) => {
            const isOpen = open === i;
            const panelId = `wid-panel-${i}`;
            return (
              <div key={card.title} data-card className="bracket-card relative !border-0">
                <span data-card-border aria-hidden="true" className="pointer-events-none absolute inset-0 border border-dashed border-text/35" />
                <span className="corner tl" aria-hidden="true" />
                <span className="corner tr" aria-hidden="true" />
                <span className="corner bl" aria-hidden="true" />
                <span className="corner br" aria-hidden="true" />
                <div data-card-body className="relative p-6 lg:p-7">
                  <h3 className="text-[clamp(1.35rem,1.6vw,1.9rem)] font-semibold tracking-wide uppercase">{card.title}</h3>
                  <p className="mt-1 text-[11px] font-medium tracking-wider text-muted">Description</p>
                  <p className="mt-3 text-sm leading-relaxed text-text/85">{card.description}</p>
                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      <p className="mt-5 text-[11px] font-medium tracking-wider text-muted">Skillset &amp; tools</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {card.skills.map((s) => (
                          <li key={s} className="rounded-md border border-text/25 bg-text/[0.06] px-2 py-1 text-[11px] text-text">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={`${isOpen ? "Hide" : "Show"} ${card.title} skills`}
                    className="absolute right-4 bottom-4 grid h-7 w-7 place-items-center border border-text/40 text-text transition-colors hover:border-accent hover:text-accent"
                  >
                    <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
