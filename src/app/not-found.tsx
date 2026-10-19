import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center"
    >
      <LogoMark className="h-14 w-14" />
      <p className="mt-10 font-display text-[clamp(6rem,28vw,14rem)] leading-none font-extrabold tracking-tighter text-accent">
        404
      </p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
        This piece is missing from the cube.
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-bg transition-transform hover:-translate-y-0.5"
      >
        <span aria-hidden="true">←</span> Back to home
      </Link>
    </main>
  );
}
