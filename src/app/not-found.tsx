import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 right-0 h-[55vh] w-[18vw] translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/45 blur-[90px]" />
      <Logo className="h-8 w-auto" />
      <p className="text-glow-fill mt-10 text-[clamp(6rem,24vw,13rem)] leading-none font-bold tracking-tight">404</p>
      <h1 className="mt-4 text-3xl font-medium uppercase sm:text-4xl">
        Page <span className="text-accent">not found</span>
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-14 items-center gap-2 rounded-full bg-black px-8 text-sm font-medium tracking-wide text-text uppercase shadow-[0_10px_30px_-12px_rgba(127,64,255,0.9),inset_0_-2px_0_rgba(127,64,255,0.55)] transition-transform hover:-translate-y-0.5"
      >
        <span aria-hidden="true">←</span> Back to home
      </Link>
    </main>
  );
}
