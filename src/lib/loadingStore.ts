"use client";

/**
 * Tiny shared store for "how much of the 3D scene has loaded" (0–100),
 * written by the character scene and read by the loader.
 */
let sceneProgress = 0;
const listeners = new Set<(v: number) => void>();

export function setSceneProgress(value: number) {
  sceneProgress = Math.max(sceneProgress, Math.min(100, value));
  listeners.forEach((l) => l(sceneProgress));
}

export function getSceneProgress() {
  return sceneProgress;
}

export function onSceneProgress(listener: (v: number) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Scroll-driven state shared between the DOM sections and the 3D character. */
export const stageState = {
  /** 0 = hero, 1 = about */
  about: 0,
  /** 0 = about, 1 = "What I do" (desk view) */
  desk: 0,
  /** Pointer position, -1..1 */
  pointerX: 0,
  pointerY: 0,
  /** True once the intro has finished and the character should be shown. */
  revealed: false,
};

/** Decides whether this device can render the 3D scenes smoothly. */
export function canRender3D() {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(location.search).get("scene") === "webgl") return true;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return false;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return false;
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}
