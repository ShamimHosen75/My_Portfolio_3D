"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { career } from "@/data/career";

/** "My career & experience": rows with a glowing line that grows as you scroll. */
export function Career() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-career-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-career-list]", start: "top 65%", end: "bottom 55%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-career-row]").forEach((row) => {
          gsap.fromTo(
            row,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 85%" } },
          );
        });
        gsap.fromTo(
          "[data-career-title] span",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%" } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="career" className="relative py-28 md:py-40" aria-labelledby="career-title">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <h2
          id="career-title"
          data-career-title
          className="text-center text-[clamp(2.4rem,4vw,4.4rem)] leading-[1.05] font-medium tracking-tight"
        >
          <span className="block">My career &amp;</span>
          <span className="block text-accent">experience</span>
        </h2>

        <div data-career-list className="relative mt-16 md:mt-24">
          {/* Glowing timeline line with its dot */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-[2px] md:left-1/2 md:-translate-x-1/2"
          >
            <div
              data-career-line
              className="relative h-full w-full origin-top bg-gradient-to-b from-transparent via-glow to-accent shadow-[0_0_12px_2px_rgba(127,64,255,0.6)]"
            >
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_5px_rgba(150,90,255,0.9)]" />
            </div>
          </div>

          <ol className="relative space-y-14 md:space-y-20">
            {career.map((item) => (
              <li
                key={`${item.place}-${item.year}`}
                data-career-row
                className="grid gap-3 pl-9 md:grid-cols-2 md:gap-[8vw] md:pl-0"
              >
                <div className="flex items-start justify-between gap-6 md:pr-[4vw]">
                  <div>
                    <h3 className="text-[clamp(1.25rem,1.6vw,1.75rem)] leading-tight font-medium">{item.title}</h3>
                    <p className="mt-1 text-sm text-accent md:text-base">{item.place}</p>
                  </div>
                  <p className="text-[clamp(1.6rem,2.6vw,2.9rem)] leading-none font-medium tabular-nums">{item.year}</p>
                </div>
                <p className="max-w-[34rem] text-sm leading-relaxed text-text/75 md:text-base">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
