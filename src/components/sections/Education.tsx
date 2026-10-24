"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { certifications, education, learning } from "@/data/education";

/** "My academic journey": education cards on the left, certifications on the right. */
export function Education() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-edu-title] > *",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%" } },
        );
        gsap.utils.toArray<HTMLElement>("[data-edu-col]").forEach((col, c) => {
          gsap.fromTo(
            col.querySelectorAll("[data-edu-card]"),
            { opacity: 0, y: 50, x: c === 0 ? -24 : 24 },
            { opacity: 1, y: 0, x: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: col, start: "top 80%" } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const chip = "rounded-md border border-line bg-text/[0.04] px-2.5 py-1 text-xs text-text/80";
  const card =
    "group relative rounded-2xl border border-line bg-[#120d16]/80 p-6 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_60px_-30px_rgba(127,64,255,0.6)] md:p-7";

  return (
    <section ref={root} id="education" className="relative py-28 md:py-40" aria-labelledby="edu-title">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <div data-edu-title className="text-center">
          <h2 id="edu-title" className="text-[clamp(2.4rem,4vw,4.4rem)] leading-[1.05] font-medium tracking-tight">
            My academic <span className="text-accent">journey</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-muted">
            My academic background and continuous learning in technology and software development.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-2 lg:gap-12">
          {/* Education */}
          <div data-edu-col>
            <h3 className="flex items-center gap-3 text-xl font-medium md:text-2xl">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 9l10-5 10 5-10 5-10-5z M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5 M22 9v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Education
            </h3>
            <ol className="mt-6 space-y-5">
              {education.map((e) => (
                <li key={e.degree} data-edu-card className={card}>
                  <h4 className="text-lg leading-snug font-semibold md:text-xl">{e.degree}</h4>
                  <p className="mt-1 text-accent">{e.school}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-xs text-text/80">
                    <li className={chip}>{e.years}</li>
                    <li className={chip}>{e.location}</li>
                    <li className="rounded-md border border-[#6ee7a0]/40 bg-[#6ee7a0]/10 px-2.5 py-1 text-[#8ff0b5]">{e.grade}</li>
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-text/75">{e.description}</p>
                  {e.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <li key={t} className="rounded-md bg-accent/15 px-2.5 py-1 text-xs text-accent">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Certifications */}
          <div data-edu-col>
            <h3 className="flex items-center gap-3 text-xl font-medium md:text-2xl">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M8 21h8 M12 17v4 M7 4h10v4a5 5 0 0 1-10 0V4z M7 6H4a3 3 0 0 0 3 4 M17 6h3a3 3 0 0 1-3 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Certifications &amp; achievements
            </h3>
            <ol className="mt-6 space-y-5">
              {certifications.map((c) => (
                <li key={c.title} data-edu-card className={`${card} flex gap-5`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glow to-accent text-bg" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M8.5 14l-1.5 7 5-3 5 3-1.5-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-lg leading-snug font-semibold md:text-xl">{c.title}</h4>
                      <span className="shrink-0 rounded-md bg-accent/15 px-2 py-0.5 text-xs text-accent tabular-nums">{c.year}</span>
                    </div>
                    <p className="mt-1 text-accent">{c.issuer}</p>
                    <p className="mt-3 text-sm leading-relaxed text-text/75">{c.description}</p>
                  </div>
                </li>
              ))}
              <li data-edu-card className={`${card} text-center`}>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-glow to-accent text-bg" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M2 9l10-5 10 5-10 5-10-5z M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h4 className="mt-4 text-lg font-semibold md:text-xl">{learning.title}</h4>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text/75">{learning.text}</p>
                <ul className="mt-5 flex flex-wrap justify-center gap-2">
                  {learning.tags.map((t) => (
                    <li key={t} className="rounded-full border border-accent/40 px-3 py-1 text-xs text-accent">
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
