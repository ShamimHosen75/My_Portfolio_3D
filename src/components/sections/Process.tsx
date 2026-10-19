"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";

export function Process() {
  const ref = useRef<HTMLElement>(null);

  // The connecting line draws itself with scroll: horizontal on desktop, vertical on mobile.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 768px)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as {
            desktop: boolean;
            motion: boolean;
          };
          const line = desktop ? ".process-line-x" : ".process-line-y";
          if (!motion) {
            gsap.set(line, { scaleX: 1, scaleY: 1 });
            gsap.set(".process-dot", {
              backgroundColor: "#F2A541",
              color: "#0F2A30",
            });
            return;
          }
          gsap.fromTo(line, desktop ? { scaleX: 0 } : { scaleY: 0 }, {
            ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
            ease: "none",
            scrollTrigger: {
              trigger: ".process-list",
              start: desktop ? "top 70%" : "top 75%",
              end: desktop ? "bottom 55%" : "bottom 60%",
              scrub: true,
            },
          });
          gsap.utils.toArray<HTMLElement>(".process-dot").forEach((dot) => {
            gsap.to(dot, {
              backgroundColor: "#F2A541",
              color: "#0F2A30",
              borderColor: "#F2A541",
              duration: 0.3,
              scrollTrigger: {
                trigger: dot,
                start: desktop ? "top 62%" : "top 65%",
                toggleActions: "play none none reverse",
              },
            });
          });
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="process"
      aria-labelledby="process-title"
      className="px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="process-title"
          eyebrow="Process"
          title="A clear path from first call to launch."
        />

        <div className="process-list relative mt-16">
          {/* Mobile: vertical line */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-6 w-px bg-line md:hidden"
          >
            <div className="process-line-y h-full w-px origin-top bg-accent" />
          </div>
          {/* Desktop: horizontal line through the numbers */}
          <div
            aria-hidden="true"
            className="absolute top-6 left-6 hidden h-px bg-line md:block"
            style={{ right: "calc(25% - 3rem)" }}
          >
            <div className="process-line-x h-px w-full origin-left bg-accent" />
          </div>

          <ol className="grid gap-12 pl-16 md:grid-cols-4 md:gap-8 md:pl-0">
            {processSteps.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="process-dot absolute top-0 -left-16 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-bg text-sm font-bold tabular-nums md:static"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-bold md:mt-8">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
