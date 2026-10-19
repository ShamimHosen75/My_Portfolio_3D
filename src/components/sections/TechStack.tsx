"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { canRender3D } from "@/lib/loadingStore";
import { techStack } from "@/data/skills";

const TechBalls = dynamic(() => import("@/components/scene/TechBalls"), { ssr: false });

/** "My Techstack": logo balls you can push around with the pointer. Loads only near the viewport. */
export function TechStack() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "flat">("pending");
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setMode(canRender3D() ? "3d" : "flat");
    setCompact(window.innerWidth < 768);
    const el = root.current;
    if (!el) return;
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px" });
    const viewIo = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "50px" });
    nearIo.observe(el);
    viewIo.observe(el);
    return () => {
      nearIo.disconnect();
      viewIo.disconnect();
    };
  }, []);

  return (
    <section ref={root} id="techstack" className="relative h-svh min-h-[34rem] overflow-hidden" aria-labelledby="tech-title">
      <h2
        id="tech-title"
        className="pointer-events-none relative z-10 pt-[12svh] text-center text-[clamp(2.2rem,4.2vw,4.8rem)] font-medium tracking-tight uppercase"
      >
        My Techstack
      </h2>
      <p className="sr-only">{techStack.map((t) => t.title).join(", ")}</p>

      {mode === "3d" && near && (
        <div data-tech-canvas className="absolute inset-0" aria-hidden="true">
          <TechBalls active={active} compact={compact} />
        </div>
      )}
      {mode === "flat" && (
        <ul className="relative z-10 mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3 px-6" aria-hidden="true">
          {techStack.map((t) => (
            <li
              key={t.title}
              className="grid h-16 w-16 place-items-center rounded-full border border-line bg-text/[0.04] md:h-20 md:w-20"
              title={t.title}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="currentColor" aria-hidden="true">
                <path d={t.path} />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
