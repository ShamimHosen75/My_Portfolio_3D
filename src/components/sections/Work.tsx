"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "@/components/ui/icons";

/** "My Work": columns that scroll sideways while the section is pinned (desktop), swipeable on phones. */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 768px) and ${MOTION_OK}`, () => {
        const el = track.current!;
        const list = el.firstElementChild as HTMLElement;
        const distance = () => Math.max(0, list.offsetWidth - el.clientWidth);
        gsap.to(list, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-work-title]",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 75%" } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative flex min-h-svh flex-col pt-24 md:h-svh md:pt-[11svh]" aria-labelledby="work-title">
      <div className="mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-[6.5vw]">
        <h2 id="work-title" data-work-title className="text-[clamp(2.4rem,4vw,4.4rem)] font-medium tracking-tight">
          My <span className="text-accent">Work</span>
        </h2>
      </div>

      <div
        ref={track}
        className="no-scrollbar relative mt-10 flex-1 overflow-x-auto border-t border-line max-md:snap-x max-md:snap-mandatory md:mt-[6svh] md:overflow-hidden"
        tabIndex={-1}
      >
        <ol className="flex h-full w-max md:pr-[6.5vw] md:pl-[6.5vw]">
          {projects.map((p, i) => {
            const flip = i % 2 === 1;
            const info = (
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[clamp(2rem,2.6vw,3rem)] leading-none font-medium tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="text-right">
                    <h3 className="text-base font-medium md:text-lg">{p.name}</h3>
                    <p className="text-xs text-muted md:text-sm">{p.category}</p>
                  </div>
                </div>
                {p.description && (
                  <p className="text-xs text-muted md:text-sm leading-relaxed line-clamp-4">{p.description}</p>
                )}
                <div>
                  <p className="text-sm font-medium">Tools and features</p>
                  <p className="mt-1 text-xs text-muted md:text-sm">{p.tools}</p>
                </div>
                <div className="flex gap-4 text-xs font-medium tracking-wide uppercase">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 border-b border-text/30 pb-0.5 hover:border-accent hover:text-accent">
                      Live site <ArrowUpRight className="h-3 w-3" />
                      <span className="sr-only">for {p.name} (opens in a new tab)</span>
                    </a>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border-b border-text/30 pb-0.5 hover:border-accent hover:text-accent">
                      Code <ArrowUpRight className="h-3 w-3" />
                      <span className="sr-only">for {p.name} on GitHub (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            );
            const image = (
              <a
                href={p.live ?? p.code ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                aria-hidden="true"
                className="group relative block aspect-[16/10] w-full overflow-hidden rounded-md bg-text/5"
              >
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 30vw, 85vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </a>
            );
            return (
              <li
                key={p.name}
                className="flex w-[85vw] shrink-0 snap-start flex-col justify-between gap-8 border-r border-line px-6 py-8 sm:w-[60vw] md:w-[clamp(24rem,31vw,38rem)] md:px-[2.4vw] md:py-[5svh]"
              >
                {flip ? (
                  <>
                    {image}
                    {info}
                  </>
                ) : (
                  <>
                    {info}
                    {image}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
