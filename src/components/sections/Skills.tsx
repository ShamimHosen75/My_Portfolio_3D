"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/skills";

export function Skills() {
  const ref = useRef<HTMLElement>(null);

  // Cards fade up one after another as the grid scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".skill-card", {
          autoAlpha: 0,
          y: 48,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".skill-grid",
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="skills"
      aria-labelledby="skills-title"
      className="px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills"
          title="The tools I reach for, and how I use them."
        />
        <div className="skill-grid mt-14 grid gap-5 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <article
              key={group.title}
              className="skill-card flex flex-col rounded-3xl border border-line bg-surface p-7 md:p-9"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-bold">{group.title}</h3>
                <span
                  className="text-sm text-muted tabular-nums"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
              </div>
              <p className="mt-2 text-muted">{group.description}</p>
              <ul
                className="mt-6 flex flex-wrap gap-2"
                aria-label={`${group.title} skills`}
              >
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line bg-bg/50 px-3.5 py-1.5 text-sm"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
