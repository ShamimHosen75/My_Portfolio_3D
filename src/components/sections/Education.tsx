"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { certifications, education, learning } from "@/data/education";


/**
 * "My academic journey": a glowing path that draws itself down the page with a light
 * travelling along it, education stops alternating left and right, and certification badges that flip in with a spinning gradient edge.
 */
export function Education() {
  const root = useRef<HTMLElement>(null);
  const pathWrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const spark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Title letters rise out of a mask, then the subtitle.
        const head = gsap.timeline({ scrollTrigger: { trigger: "[data-edu-head]", start: "top 75%" } });
        head
          .fromTo("[data-edu-ch]", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.025, ease: "power4.out" })
          .fromTo("[data-edu-sub]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4");

        // The path draws itself as you scroll and a light travels along it.
        const p = path.current;
        const wrap = pathWrap.current;
        if (p && wrap) {
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
          const glow = p.parentElement?.querySelector<SVGPathElement>("[data-path-glow]");
          if (glow) {
            glow.style.strokeDasharray = `${len}`;
            glow.style.strokeDashoffset = `${len}`;
          }
          const nodes = gsap.utils.toArray<HTMLElement>("[data-edu-node]");
          ScrollTrigger.create({
            trigger: wrap,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.5,
            onUpdate: (self) => {
              const d = len * (1 - self.progress);
              p.style.strokeDashoffset = `${d}`;
              if (glow) glow.style.strokeDashoffset = `${d}`;
              const pt = p.getPointAtLength(len * self.progress);
              const box = p.ownerSVGElement!.viewBox.baseVal;
              const r = wrap.getBoundingClientRect();
              if (spark.current) {
                spark.current.style.transform = `translate(${(pt.x / box.width) * r.width}px, ${(pt.y / box.height) * r.height}px)`;
              }
              // Light up each stop once the light has passed it.
              nodes.forEach((n) => {
                const nr = n.getBoundingClientRect();
                const y = nr.top + nr.height / 2 - r.top;
                n.dataset.lit = y <= (pt.y / box.height) * r.height + 8 ? "true" : "false";
              });
            },
          });
        }

        // Education stops: each slides in from its side with a little 3D turn.
        gsap.utils.toArray<HTMLElement>("[data-edu-stop]").forEach((el, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          gsap.fromTo(
            el,
            { opacity: 0, x: side * 60, rotateY: side * 12, transformPerspective: 1200 },
            { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } },
          );
          gsap.fromTo(
            el.querySelectorAll("[data-chip]"),
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 70%" } },
          );
        });

        // Certification badges flip in one after another.
        gsap.fromTo(
          "[data-badge]",
          { opacity: 0, rotateY: -70, y: 30, transformPerspective: 1000 },
          { opacity: 1, rotateY: 0, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: "[data-badges]", start: "top 80%" } },
        );
        gsap.fromTo("[data-learning]", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "[data-learning]", start: "top 85%" } });
        // The learning chips drift gently.
        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
          gsap.to(el, { y: -6, duration: 1.6 + i * 0.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.15 });
        });

        // Cards tilt towards the pointer.
        const cleanups = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((el) => {
          const rx = gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power3" });
          gsap.set(el, { transformPerspective: 900 });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((c) => c());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const title = "My academic journey";
  const chip = "rounded-md border border-line bg-text/[0.04] px-2.5 py-1 text-xs text-text/80";

  return (
    <section ref={root} id="education" className="relative overflow-hidden py-28 md:py-40" aria-labelledby="edu-title">
      {/* Soft glow behind the section */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 left-1/2 h-[60vh] w-[60vw] -translate-x-1/2 rounded-full bg-glow/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-10">
        <div data-edu-head className="text-center">
          <h2 id="edu-title" aria-label={title} className="text-[clamp(2.4rem,4vw,4.4rem)] leading-[1.05] font-medium tracking-tight">
            {title.split(" ").map((w, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-top whitespace-pre">
                {w.split("").map((ch, j) => (
                  <span key={j} data-edu-ch className={`inline-block ${w === "journey" ? "text-accent" : ""}`}>
                    {ch}
                  </span>
                ))}{" "}
              </span>
            ))}
          </h2>
          <p data-edu-sub className="mx-auto mt-5 max-w-xl text-[clamp(1rem,1.15vw,1.2rem)] leading-relaxed text-muted">
            My academic background and continuous learning in technology and software development.
          </p>
        </div>

        {/* Education path */}
        <div ref={pathWrap} className="relative mt-20 md:mt-28">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
          >
            <path d="M50 0 C 50 180, 44 260, 50 420 S 56 640, 50 800 S 50 940, 50 1000" fill="none" stroke="rgb(234 229 236 / 0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path data-path-glow d="M50 0 C 50 180, 44 260, 50 420 S 56 640, 50 800 S 50 940, 50 1000" fill="none" stroke="#7f40ff" strokeWidth="8" strokeOpacity="0.25" vectorEffect="non-scaling-stroke" style={{ filter: "blur(6px)" }} />
            <path ref={path} d="M50 0 C 50 180, 44 260, 50 420 S 56 640, 50 800 S 50 940, 50 1000" fill="none" stroke="url(#edu-grad)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <defs>
              <linearGradient id="edu-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c2a4ff" />
                <stop offset="1" stopColor="#7f40ff" />
              </linearGradient>
            </defs>
          </svg>
          {/* The travelling light */}
          <div ref={spark} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 -ml-2 -mt-2 h-4 w-4 rounded-full bg-accent shadow-[0_0_20px_6px_rgba(150,90,255,0.9)]" />

          <ol className="relative space-y-12 md:space-y-20">
            {education.map((e, i) => (
              <li key={e.degree} className="relative grid items-center gap-6 md:grid-cols-2 md:gap-x-24">
                {/* Stop marker on the path */}
                <span
                  data-edu-node
                  aria-hidden="true"
                  className="absolute top-8 left-1/2 hidden h-5 w-5 -translate-x-1/2 rounded-full border-2 border-text/30 bg-bg transition-all duration-500 data-[lit=true]:border-accent data-[lit=true]:bg-accent data-[lit=true]:shadow-[0_0_16px_4px_rgba(150,90,255,0.7)] md:block"
                />
                <article
                  data-edu-stop
                  data-tilt
                  className={`group relative rounded-2xl border border-line bg-[#120d16]/85 p-6 backdrop-blur-sm transition-[border-color,box-shadow] duration-500 hover:border-accent/50 hover:shadow-[0_30px_80px_-40px_rgba(127,64,255,0.8)] md:p-8 ${
                    i % 2 === 0 ? "md:col-start-1" : "md:col-start-2"
                  }`}
                >
                  <span className="text-xs font-medium tracking-[0.3em] text-accent uppercase">{e.years}</span>
                  <h3 className="mt-2 text-lg leading-snug font-semibold md:text-xl">{e.degree}</h3>
                  <p className="mt-1 text-accent">{e.school}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    <li data-chip className={chip}>{e.location}</li>
                    <li data-chip className="rounded-md border border-[#6ee7a0]/40 bg-[#6ee7a0]/10 px-2.5 py-1 text-xs text-[#8ff0b5]">{e.grade}</li>
                  </ul>
                  <p className="mt-4 text-sm leading-relaxed text-text/75">{e.description}</p>
                  {e.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {e.tags.map((t) => (
                        <li key={t} data-chip className="rounded-md bg-accent/15 px-2.5 py-1 text-xs text-accent">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>

        {/* Certifications */}
        <h3 className="mt-24 text-center text-2xl font-medium md:mt-32 md:text-3xl">
          Certifications &amp; <span className="text-accent">achievements</span>
        </h3>
        <ul data-badges className="mt-10 grid gap-5 md:grid-cols-3">
          {certifications.map((c) => (
            <li key={c.title} data-badge data-tilt className="gradient-edge group relative rounded-2xl p-px">
              <div className="relative flex h-full flex-col rounded-[calc(1rem-1px)] bg-[#120d16] p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-glow to-accent text-bg transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M8.5 14l-1.5 7 5-3 5 3-1.5-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs text-accent tabular-nums">{c.year}</span>
                </div>
                <h4 className="mt-5 text-lg leading-snug font-semibold">{c.title}</h4>
                <p className="mt-1 text-sm text-accent">{c.issuer}</p>
                <p className="mt-3 text-sm leading-relaxed text-text/75">{c.description}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Continuous learning */}
        <div data-learning className="relative mt-8 overflow-hidden rounded-2xl border border-line bg-[#120d16]/80 p-8 text-center md:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-glow/30 blur-[70px]" />
          <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-glow to-accent text-bg" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 9l10-5 10 5-10 5-10-5z M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h4 className="relative mt-4 text-xl font-semibold md:text-2xl">{learning.title}</h4>
          <p className="relative mx-auto mt-2 max-w-lg text-sm leading-relaxed text-text/75 md:text-base">{learning.text}</p>
          <ul className="relative mt-6 flex flex-wrap justify-center gap-3">
            {learning.tags.map((t) => (
              <li key={t} data-float className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm text-accent">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
