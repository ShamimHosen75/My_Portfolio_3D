"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { about } from "@/data/about";

/** About: the character slides left and the text writes itself in on the right. */
export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12, y: 6 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 55%", end: "bottom 75%", scrub: true },
          },
        );
        gsap.fromTo(
          "[data-about-title]",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 60%" } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative flex min-h-svh items-end lg:items-center" aria-labelledby="about-title">
      <div className="mx-auto grid w-full max-w-[1920px] px-6 pb-[12svh] sm:px-10 lg:grid-cols-2 lg:pb-0 lg:px-[6.5vw]">
        <div className="max-lg:rounded-2xl max-lg:bg-bg/70 max-lg:p-5 max-lg:backdrop-blur-sm lg:col-start-2 lg:max-w-[38rem] lg:pl-[2vw]">
          <h2
            id="about-title"
            data-about-title
            className="text-[clamp(1.7rem,2.6vw,3rem)] font-semibold tracking-tight text-accent uppercase"
          >
            {about.heading}
          </h2>
          <p className="mt-5 text-[clamp(1.15rem,1.55vw,1.75rem)] leading-[1.45] font-light text-text">
            {about.text.split(" ").map((w, i) => (
              <span key={i} data-word className="inline-block whitespace-pre">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
