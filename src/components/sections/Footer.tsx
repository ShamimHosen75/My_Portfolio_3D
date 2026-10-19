"use client";

import { Logo } from "@/components/ui/Logo";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/data/site";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  return (
    <footer className="border-t border-line px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <Logo />
        <p className="text-sm text-muted" suppressHydrationWarning>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <button
          type="button"
          onClick={() => {
            scrollTo(0);
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
