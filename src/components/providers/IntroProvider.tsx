"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const INTRO_KEY = "intro-played";

interface IntroState {
  /** null until we know (after mount), then whether the intro animation should play. */
  playIntro: boolean | null;
  /** True once the hero is revealed (intro finished, skipped, or never shown). */
  done: boolean;
  finish: () => void;
}

const IntroContext = createContext<IntroState>({
  playIntro: null,
  done: false,
  finish: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [playIntro, setPlayIntro] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // The inline script in layout.tsx sets data-intro="skip" before first paint.
    const skip = document.documentElement.dataset.intro === "skip";
    setPlayIntro(!skip);
    if (skip) {
      setDone(true);
    } else {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Storage can be blocked (private mode); the intro just plays again next time.
    }
    setDone(true);
  }, []);

  const value = useMemo(
    () => ({ playIntro, done, finish }),
    [playIntro, done, finish],
  );
  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export const useIntro = () => useContext(IntroContext);

/** Runs before paint (inlined in <head>) so returning visitors never see the overlay flash. */
export const introBootScript = `try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='skip';d.dataset.reducedMotion='';}else if(sessionStorage.getItem('${INTRO_KEY}')){d.dataset.intro='skip';}}catch(e){}`;
