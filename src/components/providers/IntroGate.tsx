"use client";

import { useIntro } from "./IntroProvider";

/** Keeps the page out of the tab order and away from screen readers while the loader plays. */
export function IntroGate({ children }: { children: React.ReactNode }) {
  const { playIntro, done } = useIntro();
  const hidden = playIntro === true && !done;
  return (
    <div inert={hidden} aria-hidden={hidden || undefined}>
      {children}
    </div>
  );
}
