"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { useIntro } from "@/components/providers/IntroProvider";
import { LogoMark } from "@/components/ui/Logo";
import { site } from "@/data/site";

// The 3D scene (three.js + R3F) loads in its own chunk, only when the intro actually plays.
const CubeScene = dynamic(() => import("./CubeScene"), {
  ssr: false,
  loading: () => null,
});

const MIN_DURATION = 2500;
const FAILSAFE = 9000;
const INERT_TARGETS = [
  'a[href="#main"]',
  "#main",
  "[data-site-header]",
  "footer",
];

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * True when the device can render the 3D cube smoothly. Software-rendered WebGL
 * (no GPU), very low core counts and Data Saver get the lightweight CSS cube instead.
 */
function canRender3D() {
  try {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    if (nav.connection?.saveData) return false;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return false;
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(
      renderer,
    );
  } catch {
    return false;
  }
}

const STICKERS = [
  "#E4572E",
  "#3BA99C",
  "#DCE7E2",
  "#F4D35E",
  "#F2A541",
  "#4F86C6",
];

/** A CSS-only cube for devices without fast WebGL. Animated on the compositor, so it costs almost nothing. */
function CssCube() {
  const faces = ["front", "back", "right", "left", "top", "bottom"];
  return (
    <div className="css-cube-scene absolute inset-0 flex items-center justify-center">
      <div className="css-cube">
        {faces.map((face, f) => (
          <div key={face} className={`css-cube-face css-cube-${face}`}>
            {Array.from({ length: 9 }, (_, i) => (
              <span
                key={i}
                style={{ background: STICKERS[(f + i * 2 + (i % 3)) % 6] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type Phase = "loading" | "revealing" | "done";

export function Preloader() {
  const { playIntro, finish } = useIntro();
  const [phase, setPhase] = useState<Phase>("loading");
  const [scene, setScene] = useState<"pending" | "webgl" | "css">("pending");
  const [exploding, setExploding] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const assets = useRef({ page: false, fonts: false, scene: 0 });
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const phaseRef = useRef<Phase>("loading");
  phaseRef.current = phase;

  const onSceneProgress = useCallback((value: number) => {
    assets.current.scene = Math.max(assets.current.scene, value);
  }, []);
  const onSceneError = useCallback(() => {
    assets.current.scene = 100;
  }, []);

  const reveal = useCallback(() => {
    if (phaseRef.current !== "loading") return;
    setPhase("revealing");
    setExploding(true);
    timeline.current = gsap
      .timeline()
      .to(uiRef.current, {
        autoAlpha: 0,
        y: -24,
        duration: 0.3,
        ease: "power2.in",
      })
      .to(
        bgRef.current,
        { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" },
        0.2,
      )
      .add(() => finish(), 0.45)
      .to(
        sceneRef.current,
        { autoAlpha: 0, duration: 0.5, ease: "power1.out" },
        1.1,
      )
      .add(() => setPhase("done"));
  }, [finish]);

  const skip = useCallback(() => {
    if (phaseRef.current === "done") return;
    timeline.current?.kill();
    setPhase("revealing");
    finish();
    gsap.to(rootRef.current, {
      autoAlpha: 0,
      duration: 0.3,
      onComplete: () => setPhase("done"),
    });
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [finish]);

  // Keep the page behind the overlay out of the tab order while the intro plays.
  useEffect(() => {
    if (playIntro !== true || phase !== "loading") return;
    const nodes = INERT_TARGETS.flatMap((s) =>
      Array.from(document.querySelectorAll<HTMLElement>(s)),
    );
    nodes.forEach((n) => n.setAttribute("inert", ""));
    return () => nodes.forEach((n) => n.removeAttribute("inert"));
  }, [playIntro, phase]);

  // Loading loop: the counter follows the slower of real asset progress and the minimum duration.
  useEffect(() => {
    if (playIntro !== true) return;
    const a = assets.current;

    // Add ?scene=webgl to the URL to force the 3D cube (handy when testing on a machine without a GPU).
    const forced = new URLSearchParams(location.search).get("scene") === "webgl";
    if (forced || canRender3D()) {
      setScene("webgl");
    } else {
      setScene("css");
      a.scene = 100;
    }

    const onLoad = () => (a.page = true);
    if (document.readyState === "complete") a.page = true;
    else window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready
      .then(() => (a.fonts = true))
      .catch(() => (a.fonts = true));
    if (!document.fonts) a.fonts = true;

    const failsafe = window.setTimeout(() => {
      a.page = a.fonts = true;
      a.scene = 100;
    }, FAILSAFE);

    const start = performance.now();
    let shown = 0;
    let last = start;
    let lastInt = -1;
    let raf = 0;

    const frame = () => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      const timeFrac = Math.min(1, Math.max(0, (now - start) / MIN_DURATION));
      const assetFrac =
        (a.page ? 0.25 : 0) + (a.fonts ? 0.15 : 0) + 0.6 * (a.scene / 100);
      const target = Math.min(timeFrac, assetFrac) * 100;
      // Ease toward the target, but never slower than 60%/s, so the end doesn't crawl.
      const eased = (target - shown) * (1 - Math.exp(-dt / 120));
      shown = Math.min(target, shown + Math.max(eased, (dt / 1000) * 60));

      const value = Math.floor(shown);
      if (value !== lastInt) {
        lastInt = value;
        if (counterRef.current)
          counterRef.current.textContent = `${String(value).padStart(2, "0")}%`;
        progressRef.current?.setAttribute("aria-valuenow", String(value));
      }
      if (barRef.current)
        barRef.current.style.transform = `scaleX(${shown / 100})`;

      if (shown >= 100) {
        reveal();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", onKey);
    };
  }, [playIntro, reveal, skip]);

  useEffect(() => () => void timeline.current?.kill(), []);

  if (playIntro === false || phase === "done") return null;

  return (
    <div
      ref={rootRef}
      aria-hidden={phase === "revealing" ? true : undefined}
      inert={phase === "revealing"}
      className={`preloader fixed inset-0 z-[100] ${phase === "revealing" ? "is-revealing pointer-events-none" : ""}`}
    >
      <div ref={bgRef} className="absolute inset-0 bg-bg" />

      <div
        ref={sceneRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {scene === "webgl" && (
          <SceneBoundary onError={onSceneError}>
            <CubeScene exploding={exploding} onProgress={onSceneProgress} />
          </SceneBoundary>
        )}
        {scene === "css" && <CssCube />}
      </div>

      <div
        ref={uiRef}
        className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 md:p-12"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2.5 text-sm font-medium text-muted">
            <LogoMark className="h-7 w-7" />
            {site.name}
          </span>
          <button
            type="button"
            onClick={skip}
            className="rounded-full border border-line bg-bg/60 px-4 py-2 text-sm font-semibold text-text backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            Skip intro
          </button>
        </div>

        <div>
          <div
            ref={progressRef}
            role="progressbar"
            aria-label="Loading portfolio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className="flex items-end justify-between gap-4"
          >
            <span className="text-xs tracking-[0.3em] text-muted uppercase sm:text-sm">
              Loading
            </span>
            <span
              ref={counterRef}
              className="font-display text-[22vw] leading-[0.8] font-extrabold tracking-tighter text-text tabular-nums sm:text-[9rem] md:text-[11rem]"
            >
              00%
            </span>
          </div>
          <div className="mt-5 h-px w-full bg-line">
            <div
              ref={barRef}
              className="h-px w-full origin-left scale-x-0 bg-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
