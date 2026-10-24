"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { testimonials } from "@/data/testimonials";

const AUTOPLAY_MS = 6000;
const count = testimonials.length;

/** Shortest signed distance from the active card, so the slider loops without a jump. */
const offsetOf = (i: number, active: number) => {
  let d = (i - active + count) % count;
  if (d > count / 2) d -= count;
  return d;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** "What clients say": a looping card slider with drag, arrows, dots and autoplay. */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const first = useRef(true);
  const reduced = useRef(false);

  const go = useCallback((dir: number) => setActive((a) => (a + dir + count) % count), []);

  // Section heading and slider rise in when they come into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-tm-title] span",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 70%" } },
        );
        gsap.fromTo(
          "[data-tm-stage]",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "[data-tm-stage]", start: "top 85%" } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Move every card to its slot: the active one in the middle, neighbours dimmed at the sides.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth >= 768;
    cards.current.forEach((el, i) => {
      if (!el) return;
      const d = offsetOf(i, active);
      const visible = Math.abs(d) <= 1;
      const vars = {
        xPercent: d * (wide ? 78 : 104),
        scale: d === 0 ? 1 : 0.86,
        rotateY: d * -8,
        opacity: d === 0 ? 1 : visible ? (wide ? 0.32 : 0) : 0,
        filter: d === 0 ? "blur(0px)" : "blur(2px)",
        zIndex: d === 0 ? 3 : visible ? 2 : 1,
      };
      if (first.current || reduced.current) gsap.set(el, vars);
      else gsap.to(el, { ...vars, duration: 1, ease: "power3.inOut", overwrite: true });
      el.inert = d !== 0;
    });
    // The new quote's words rise in after the card arrives.
    const words = cards.current[active]?.querySelectorAll("[data-tm-word] > span");
    if (words && !first.current && !reduced.current) {
      gsap.fromTo(words, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.015, ease: "power3.out", delay: 0.35, overwrite: true });
    }
    first.current = false;
  }, [active]);

  // Re-place cards when the layout width changes.
  useEffect(() => {
    const onResize = () => {
      const wide = window.innerWidth >= 768;
      cards.current.forEach((el, i) => {
        if (!el) return;
        const d = offsetOf(i, active);
        gsap.set(el, { xPercent: d * (wide ? 78 : 104), opacity: d === 0 ? 1 : Math.abs(d) <= 1 && wide ? 0.32 : 0 });
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  // Autoplay only while the section is on screen and nobody is interacting.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || reduced.current) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, inView, go]);

  // Drag or swipe to change slides.
  const drag = useRef<{ x: number; id: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };

  return (
    <section ref={root} id="testimonials" className="relative overflow-hidden py-28 md:py-40" aria-labelledby="tm-title">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        <h2
          id="tm-title"
          data-tm-title
          className="text-center text-[clamp(2.4rem,4vw,4.4rem)] leading-[1.05] font-medium tracking-tight"
        >
          <span className="block">What clients</span>
          <span className="block text-accent">say about me</span>
        </h2>

        <div
          data-tm-stage
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          className="relative mt-16 md:mt-24"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
          }}
        >
          {/* Glow behind the active card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/30 blur-[90px]"
          />

          <div
            className="relative mx-auto grid w-full max-w-[44rem] touch-pan-y select-none [perspective:1400px]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (drag.current = null)}
          >
            {testimonials.map((t, i) => (
              <figure
                key={i}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== active}
                className="col-start-1 row-start-1 flex flex-col rounded-3xl border border-line bg-[#120d16]/90 p-7 shadow-[0_30px_80px_-40px_rgba(127,64,255,0.7)] backdrop-blur-md will-change-transform md:p-12"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <svg viewBox="0 0 32 24" className="h-7 w-9 text-accent md:h-9 md:w-12" fill="currentColor" aria-hidden="true">
                  <path d="M0 24V14C0 6.3 4.6 1.6 12 0l1.4 3.2C9 4.6 6.9 7.4 6.6 11H12v13H0Zm19 0V14c0-7.7 4.6-12.4 12-14l1.4 3.2C28 4.6 25.9 7.4 25.6 11H31v13H19Z" />
                </svg>
                <blockquote className="mt-6 text-[clamp(1.15rem,1.6vw,1.6rem)] leading-[1.4] font-medium text-text">
                  {t.quote.split(" ").map((w, j) => (
                    <span key={j} data-tm-word className="inline-block overflow-hidden pb-[0.08em] align-top whitespace-pre">
                      <span className="inline-block">{w} </span>
                    </span>
                  ))}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-glow to-accent text-sm font-semibold text-bg"
                  >
                    {initials(t.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                  <span className="flex gap-0.5 text-accent" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, s) => (
                      <svg key={s} viewBox="0 0 20 20" className={`h-4 w-4 ${s < t.rating ? "" : "opacity-25"}`} fill="currentColor" aria-hidden="true">
                        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
                      </svg>
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Controls */}
          <div className="relative mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid h-12 w-12 place-items-center rounded-full border border-line text-text transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-accent"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === active}
                  className="group grid h-6 place-items-center px-0.5"
                >
                  <span
                    className={`relative block h-1.5 overflow-hidden rounded-full bg-text/20 transition-[width] duration-500 ${i === active ? "w-10" : "w-1.5 group-hover:bg-text/40"}`}
                  >
                    {i === active && (
                      <span
                        key={`${active}-${paused}-${inView}`}
                        className={`tm-progress absolute inset-0 origin-left rounded-full bg-accent ${paused || !inView ? "[animation-play-state:paused]" : ""}`}
                        style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid h-12 w-12 place-items-center rounded-full border border-line text-text transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-bg focus-visible:outline-2 focus-visible:outline-accent"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            Testimonial {active + 1} of {count}
          </p>
        </div>
      </div>
    </section>
  );
}
