"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useIntro } from "@/components/providers/IntroProvider";
import { getSceneProgress } from "@/lib/loadingStore";
import { loaderWords } from "@/data/site";

const MIN_DURATION = 2500;

type Phase = "loading" | "welcome" | "expand" | "cover" | "reveal" | "gone";

/**
 * First-visit loader: light screen with a scrolling marquee and a "LOADING xx%" pill.
 * The percentage follows real progress (fonts, page load and the 3D scene),
 * never finishes before 2.5s, then says WELCOME, cuts to black and fades into the site.
 */
export function Loader() {
  const { playIntro, finish } = useIntro();
  const [phase, setPhase] = useState<Phase>("loading");
  const [shown, setShown] = useState(0);
  const counterRef = useRef(0);

  useEffect(() => {
    if (playIntro !== true) return;
    const start = performance.now();
    let fonts = 0;
    let page = document.readyState === "complete" ? 1 : 0;
    let raf = 0;
    let finished = false;

    document.fonts?.ready.then(() => (fonts = 1)).catch(() => (fonts = 1));
    const onLoad = () => (page = 1);
    window.addEventListener("load", onLoad);

    const tick = () => {
      const now = performance.now();
      const elapsed = now - start;
      // Real progress: fonts 15%, page load 25%, 3D scene 60%.
      const real = fonts * 15 + page * 25 + getSceneProgress() * 0.6;
      // Time cap so the bar never outruns the minimum duration.
      const timeCap = Math.min(100, (elapsed / MIN_DURATION) * 100);
      const target = Math.min(real, timeCap);
      const next = counterRef.current + (target - counterRef.current) * 0.08;
      counterRef.current = target - next < 0.5 ? target : next;
      setShown(Math.floor(counterRef.current));
      if (counterRef.current >= 100 && !finished) {
        finished = true;
        setPhase("welcome");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Never trap anyone: give up waiting after 12s.
    const failSafe = window.setTimeout(() => {
      if (!finished) {
        finished = true;
        cancelAnimationFrame(raf);
        setShown(100);
        setPhase("welcome");
      }
    }, 12000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failSafe);
      window.removeEventListener("load", onLoad);
    };
  }, [playIntro]);

  // WELCOME → black cover → reveal the site.
  useEffect(() => {
    if (phase === "welcome") {
      const t = window.setTimeout(() => setPhase("expand"), 950);
      return () => clearTimeout(t);
    }
    if (phase === "expand") {
      // The pill grows until it swallows the screen.
      const t = window.setTimeout(() => setPhase("cover"), 750);
      return () => clearTimeout(t);
    }
    if (phase === "cover") {
      const t = window.setTimeout(() => {
        setPhase("reveal");
        finish();
      }, 450);
      return () => clearTimeout(t);
    }
    if (phase === "reveal") {
      const t = window.setTimeout(() => setPhase("gone"), 900);
      return () => clearTimeout(t);
    }
  }, [phase, finish]);

  // Escape skips the loader.
  useEffect(() => {
    if (playIntro !== true || phase !== "loading") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhase("cover");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playIntro, phase]);

  if (playIntro === false || phase === "gone") return null;

  const marquee = [...loaderWords, ...loaderWords];
  const leaving = phase === "reveal";

  return (
    <div
      className={`loader fixed inset-0 z-[100] ${leaving ? "is-leaving pointer-events-none" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={phase === "loading" ? `Loading ${shown}%` : "Welcome"}
    >
      {/* Light screen */}
      <div
        className={`absolute inset-0 overflow-hidden bg-paper text-ink transition-opacity duration-300 ${
          phase === "cover" || leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Logo className="h-6 w-auto md:h-7" />
          <div className="flex h-5 items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="eq-bar block w-[2px] rounded-full bg-ink"
                style={{ height: "100%", animationDelay: `${i * -0.23}s` }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" aria-hidden="true">
          <div className="animate-marquee flex w-max whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {marquee.map((word, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="flex items-center text-[clamp(2.6rem,6.2vw,6.5rem)] leading-none font-semibold tracking-[-0.01em] uppercase"
                  >
                    <span className="px-[0.35em]">{word}</span>
                    <span className="text-[0.5em]">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Pill: its black shape grows to cover the screen when the intro ends */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-[clamp(3.6rem,5.6vw,5.4rem)] w-[clamp(14rem,19vw,19rem)] -translate-x-1/2 -translate-y-1/2 rounded-[9999px] bg-[#0b080c] shadow-[0_10px_30px_-12px_rgba(127,64,255,0.9),inset_0_-2px_0_rgba(127,64,255,0.55)] transition-[width,height] duration-700 ease-[cubic-bezier(.75,0,.25,1)]"
          style={phase === "expand" ? { width: "260vmax", height: "160vmax" } : undefined}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`relative flex h-[clamp(3.6rem,5.6vw,5.4rem)] w-[clamp(14rem,19vw,19rem)] items-center justify-between px-[clamp(1.5rem,2vw,2.2rem)] text-[clamp(0.8rem,0.85vw,0.95rem)] font-medium tracking-wide text-paper transition-opacity duration-200 ${
              phase === "expand" ? "opacity-0" : ""
            }`}
          >
            {phase === "loading" ? (
              <>
                <span>LOADING</span>
                <span className="tabular-nums text-paper/70">
                  {shown}%<span className="ml-0.5 inline-block h-[1em] w-[0.45em] translate-y-[0.15em] bg-paper/80" />
                </span>
              </>
            ) : (
              <span className="mx-auto flex items-center gap-2">
                <span className="inline-block h-[1em] w-[0.3em] bg-paper" />
                <span className="flex">
                  {"WELCOME".split("").map((ch, i) => (
                    <span key={i} className="type-in" style={{ animationDelay: `${i * 55}ms` }}>
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Black cover that fades out to reveal the site */}
      <div
        className={`absolute inset-0 bg-black transition-opacity ${
          phase === "cover" ? "opacity-100 duration-0" : leaving ? "opacity-0 duration-700" : "opacity-0 duration-0"
        }`}
      />
    </div>
  );
}
