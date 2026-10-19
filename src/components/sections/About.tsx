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
        // Words rise out of a mask in reading order, as in the reference, when the section arrives.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 45%", toggleActions: "play none none reverse" },
        });
        tl.fromTo("[data-about-title]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0).fromTo(
          "[data-word] > span",
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.012, ease: "power3.out" },
          0.1,
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
            className="text-[clamp(0.8rem,0.85vw,1rem)] font-medium tracking-[0.35em] text-accent uppercase"
          >
            {about.heading}
          </h2>
          <p className="mt-4 text-[clamp(1.15rem,1.45vw,1.7rem)] leading-[1.3] font-semibold tracking-[0.01em] text-text">
            {about.text.split(" ").map((w, i) => (
              <span key={i} data-word className="inline-block overflow-hidden pb-[0.08em] align-top whitespace-pre">
                <span className="inline-block">{w} </span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
