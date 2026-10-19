"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Soft lavender circle that trails the mouse and grows over links. Mouse users only. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 0.45;
    const x = gsap.quickTo(el, "x", { duration, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration, ease: "power3.out" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      x(e.clientX);
      y(e.clientY);
      const interactive = (e.target as Element | null)?.closest?.("a, button, [data-cursor='hover']");
      el.dataset.hover = interactive ? "true" : "false";
    };
    const onLeave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-hover="false"
      className="pointer-events-none invisible fixed top-0 left-0 z-[150] -mt-4 -ml-4 h-8 w-8 rounded-full bg-[#e2cfff] opacity-0 transition-[width,height,margin] duration-300 data-[hover=true]:-mt-8 data-[hover=true]:-ml-8 data-[hover=true]:h-16 data-[hover=true]:w-16 data-[hover=true]:bg-[#e2cfff]/35"
    />
  );
}
