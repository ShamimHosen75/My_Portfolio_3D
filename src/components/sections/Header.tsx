"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { navLinks } from "@/data/site";

const OBSERVED = ["hero", ...navLinks.map((l) => l.id), "contact"];

export function Header() {
  const { scrollTo, lock, unlock } = useSmoothScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const [open, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (!openRef.current) {
        if (y > last + 6 && y > 120) setHidden(true);
        else if (y < last - 6 || y < 120) setHidden(false);
      }
      setScrolled(y > 24);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    OBSERVED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Mobile menu: lock scroll, move focus in, trap Tab, close on Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    lock();
    const toggle = toggleRef.current;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      );
    const first = focusables()[0];
    const id = window.setTimeout(() => first?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      unlock();
      toggle?.focus({ preventScroll: true });
    };
  }, [open, lock, unlock]);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    // Give the menu a moment to close and release the scroll lock.
    window.setTimeout(() => scrollTo(id), 60);
  };

  return (
    <>
      <header
        data-site-header
        className={`fixed inset-x-0 top-0 z-50 px-5 sm:px-8 transition-[transform,background-color,border-color] duration-500 ease-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"}`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 md:h-20"
        >
          <a
            href="#hero"
            onClick={go("hero")}
            aria-label="Shamim. Back to top"
            className="rounded-md"
          >
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-accent" : "text-muted hover:text-text"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={go("contact")}
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Let&apos;s talk
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
            >
              <span className="sr-only">Open menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-in menu (kept outside the header so its transform doesn't affect it). */}
      <div
        className={`fixed inset-0 z-[60] bg-bg/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(86vw,360px)] flex-col border-l border-line bg-surface p-6 transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={close}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line"
          >
            <span className="sr-only">Close menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <ul className="mt-12 flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={go(link.id)}
                aria-current={active === link.id ? "true" : undefined}
                className={`flex items-baseline gap-4 rounded-lg py-3 text-3xl font-semibold ${
                  active === link.id ? "text-accent" : "text-text"
                }`}
              >
                <span className="text-sm text-muted tabular-nums">
                  0{i + 1}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={go("contact")}
          className="mt-auto inline-flex justify-center rounded-full bg-accent px-6 py-4 font-semibold text-bg"
        >
          Let&apos;s talk
        </a>
      </div>
    </>
  );
}
