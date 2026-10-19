"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIntro } from "./IntroProvider";

interface ScrollState {
  lenis: Lenis | null;
  /** Scrolls to an element id or to the top, smoothly when motion is allowed. */
  scrollTo: (target: string | number) => void;
  lock: () => void;
  unlock: () => void;
}

const ScrollContext = createContext<ScrollState>({
  lenis: null,
  scrollTo: () => {},
  lock: () => {},
  unlock: () => {},
});

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const { done: introDone } = useIntro();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [locks, setLocks] = useState(0);

  // Lenis drives the scroll; GSAP's ticker drives Lenis; every Lenis scroll updates ScrollTrigger.
  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  const locked = !introDone || locks > 0;

  useEffect(() => {
    if (locked) lenis?.stop();
    else lenis?.start();
  }, [lenis, locked]);

  useEffect(() => {
    const root = document.documentElement;
    if (locks > 0) root.dataset.scrollLocked = "";
    else delete root.dataset.scrollLocked;
  }, [locks]);

  // Layout changes once the intro overlay is gone, so re-measure every trigger.
  useEffect(() => {
    if (!introDone) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [introDone]);

  const scrollTo = useCallback(
    (target: string | number) => {
      const el =
        typeof target === "string" ? document.getElementById(target) : null;
      if (typeof target === "string" && !el) return;
      if (lenis) {
        lenis.scrollTo(el ?? (target as number), {
          duration: 1.2,
          force: true,
        });
      } else if (el) {
        el.scrollIntoView({ behavior: "auto" });
      } else {
        window.scrollTo({ top: target as number, behavior: "auto" });
      }
    },
    [lenis],
  );

  const lock = useCallback(() => setLocks((n) => n + 1), []);
  const unlock = useCallback(() => setLocks((n) => Math.max(0, n - 1)), []);

  const value = useMemo(
    () => ({ lenis, scrollTo, lock, unlock }),
    [lenis, scrollTo, lock, unlock],
  );
  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

export const useSmoothScroll = () => useContext(ScrollContext);
