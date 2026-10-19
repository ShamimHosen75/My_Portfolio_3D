"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, type Project } from "@/data/projects";

const pad = (n: number) => String(n).padStart(2, "0");
const PIN_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const current = useRef(0);

  const setActive = (index: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, index));
    if (clamped === current.current) return;
    current.current = clamped;
    if (counterRef.current) counterRef.current.textContent = pad(clamped + 1);
  };

  // Desktop: pin the section and move the row sideways as you scroll down.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;
        section.dataset.pinned = "";
        track.dataset.pinned = "";
        track.scrollLeft = 0;
        const distance = () =>
          Math.max(0, track.scrollWidth - track.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(Math.round(self.progress * (projects.length - 1))),
          },
        });
        ScrollTrigger.refresh();

        return () => {
          delete section.dataset.pinned;
          delete track.dataset.pinned;
          gsap.set(track, { clearProps: "transform" });
        };
      });
    },
    { scope: sectionRef },
  );

  // Mobile and reduced motion: a native swipe carousel; the counter follows the scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (track.dataset.pinned !== undefined) return;
        const card = track.querySelector<HTMLElement>("li");
        if (!card) return;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const atEnd =
          track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
        setActive(
          atEnd
            ? projects.length - 1
            : Math.round(track.scrollLeft / (card.offsetWidth + gap)),
        );
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-title"
      className="relative overflow-hidden py-24 md:py-32 data-[pinned]:flex data-[pinned]:h-[100svh] data-[pinned]:flex-col data-[pinned]:justify-center data-[pinned]:py-0"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title="Selected work."
        />
        <p
          className="font-display text-2xl font-bold tabular-nums md:text-3xl"
          aria-hidden="true"
        >
          <span ref={counterRef} className="text-accent">
            01
          </span>
          <span className="text-muted"> / {pad(projects.length)}</span>
        </p>
      </div>

      <ul
        ref={trackRef}
        aria-label="Projects"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 sm:scroll-px-8 sm:px-8 md:gap-8 data-[pinned]:snap-none data-[pinned]:overflow-visible lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </ul>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <li className="w-[84vw] max-w-[560px] shrink-0 snap-start sm:w-[62vw] md:w-[46vw] lg:w-[36vw]">
      <article
        aria-labelledby={`project-${index}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-bg">
          {project.video ? (
            <video
              className="h-full w-full object-cover"
              src={project.video}
              poster={project.image}
              muted
              loop
              playsInline
              autoPlay
              preload="none"
              aria-label={`${project.name} preview`}
            />
          ) : (
            <Image
              src={project.image}
              alt={`Screenshot of ${project.name}`}
              fill
              sizes="(min-width: 1024px) 36vw, (min-width: 768px) 46vw, 84vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="text-sm text-muted tabular-nums">
            {pad(index + 1)} / {pad(projects.length)}
          </p>
          <h3
            id={`project-${index}`}
            className="mt-2 text-2xl font-bold md:text-3xl"
          >
            {project.name}
          </h3>
          <p className="mt-2 text-muted">{project.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-bg/60 px-3 py-1 text-xs font-medium text-text"
              >
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live site: ${project.name} (opens in a new tab)`}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg"
              >
                Live site <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.code ? (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Code: ${project.name} on GitHub (opens in a new tab)`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent"
              >
                Code <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full border border-dashed border-line px-5 py-2.5 text-sm text-muted">
                Private code
              </span>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
