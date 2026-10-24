"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { canRender3D, onSceneProgress, setSceneProgress, stageState } from "@/lib/loadingStore";

const CharacterScene = dynamic(() => import("./CharacterScene"), { ssr: false });

/**
 * Wraps the hero, about and "What I do" sections with one sticky 3D canvas behind them.
 * Scroll position drives the camera; devices that can't render WebGL smoothly get still images.
 */
export function CharacterStage({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const posterHero = useRef<HTMLDivElement>(null);
  const posterDesk = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "poster">("pending");
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const { done } = useIntro();

  useEffect(() => {
    const ok = canRender3D();
    setMode(ok ? "3d" : "poster");
    if (!ok) setSceneProgress(100);
  }, []);

  useEffect(() => onSceneProgress((v) => v >= 100 && setReady(true)), []);

  useEffect(() => {
    stageState.revealed = done;
  }, [done]);

  // Pause rendering while the stage is off screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer tracking for the head.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      stageState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      stageState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const update = () => {
        if (posterDesk.current) posterDesk.current.style.opacity = String(stageState.desk);
        if (posterHero.current) {
          posterHero.current.style.opacity = String(1 - stageState.desk);
          posterHero.current.style.transform = `translateX(${stageState.about * -18}%) scale(${1 + stageState.about * 0.15})`;
        }
      };
      const bind = (id: string, key: "about" | "desk") =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top bottom",
          end: "top 15%",
          onUpdate: (self) => {
            stageState[key] = self.progress;
            update();
          },
          onRefresh: (self) => {
            stageState[key] = self.progress;
            update();
          },
        });
      mm.add(MOTION_OK, () => {
        bind("about", "about");
        bind("what-i-do", "desk");
      });
      // Reduced motion: no scroll-driven camera moves, but the views still change per section.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const snap = (id: string, key: "about" | "desk") =>
          ScrollTrigger.create({
            trigger: `#${id}`,
            start: "top 60%",
            onToggle: (self) => {
              stageState[key] = self.isActive || self.progress > 0 ? 1 : 0;
              update();
            },
            end: "max",
          });
        snap("about", "about");
        snap("what-i-do", "desk");
      });
      // On phones the desk view sits behind the cards, so it dims.
      mm.add("(max-width: 1023px)", () => {
        gsap.to(layer.current, {
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: "#what-i-do", start: "top 70%", end: "top 20%", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: wrap, dependencies: [mode] },
  );

  return (
    <div ref={wrap} className="relative">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div ref={layer} className="sticky top-0 h-svh w-full overflow-hidden">
          {/* Purple glow behind the shoulders */}
          <div className="absolute top-[58%] left-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/35 blur-[90px]" />
          {mode === "3d" && <CharacterScene active={active} />}
          {/* The still image is server-rendered so it paints early; with 3D it hides once the scene is ready. */}
          {!(mode === "3d" && ready) && (
            <div ref={posterHero} className="absolute inset-0 origin-[50%_30%] transition-opacity duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/character-hero.webp"
                alt=""
                width={806}
                height={1164}
                className="absolute bottom-0 left-1/2 h-[58svh] w-auto max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[66svh] lg:h-[80svh]"
                fetchPriority="high"
              />
            </div>
          )}
          {mode === "poster" && (
            <div ref={posterDesk} className="absolute inset-0 opacity-0 transition-opacity duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/character-desk.webp"
                alt=""
                width={1050}
                height={1083}
                loading="lazy"
                className="absolute top-1/2 left-1/2 h-[50svh] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain lg:left-[47%] lg:h-[64svh]"
              />
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
