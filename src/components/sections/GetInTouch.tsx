"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

const fields = [
  { id: "name", label: "Your name", type: "text", autoComplete: "name" },
  { id: "email", label: "Your email", type: "email", autoComplete: "email" },
] as const;

/** Call to action with a marquee line, then the contact form. */
export function GetInTouch() {
  const root = useRef<HTMLElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // CTA: words rise out of a mask, then the button pops in.
        const cta = gsap.timeline({ scrollTrigger: { trigger: "[data-cta]", start: "top 70%" } });
        cta
          .fromTo("[data-cta-word] > span", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "power4.out" })
          .fromTo("[data-cta-sub]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
          .fromTo("[data-cta-btn]", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2)" }, "-=0.4");

        // The marquee drifts with the scroll.
        gsap.to("[data-marquee]", {
          xPercent: -25,
          ease: "none",
          scrollTrigger: { trigger: "[data-marquee-wrap]", start: "top bottom", end: "bottom top", scrub: 0.6 },
        });

        // Form: the card rises, then each field in turn, with the glowing underline drawing in.
        const f = gsap.timeline({ scrollTrigger: { trigger: "[data-form]", start: "top 75%" } });
        f.fromTo("[data-form]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
          .fromTo("[data-field]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, "-=0.6")
          .fromTo("[data-field] [data-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }, "<0.1")
          .fromTo("[data-submit]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");

        // Magnetic buttons: they lean towards the pointer and spring back.
        const magnets = gsap.utils.toArray<HTMLElement>("[data-magnet]");
        const cleanups = magnets.map((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((c) => c());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    form.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => form.current?.querySelector<HTMLInputElement>("#name")?.focus({ preventScroll: true }), 700);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 503) {
        const subject = encodeURIComponent(`Message from ${data.name} via your portfolio`);
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        setStatus("sent");
        return;
      }
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.current?.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
      gsap.fromTo(button.current, { x: -6 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }
  };

  const marquee = Array.from({ length: 6 }, () => "Let's work together");

  return (
    <section ref={root} id="contact" className="relative overflow-hidden" aria-labelledby="cta-title">

      {/* ── Call to action ─────────────────────────────────────────────── */}
      <div data-cta className="mx-auto w-full max-w-[1920px] px-6 pt-28 sm:px-10 md:pt-40 lg:px-[6.5vw]">

        {/* Headline + sub + buttons — centred on all sizes */}
        <div className="flex flex-col items-center text-center">
          <h2
            id="cta-title"
            className="text-[clamp(2.4rem,5.5vw,6.5rem)] leading-[0.98] font-medium tracking-tight"
          >
            {["Have", "a", "project", "in", "mind?"].map((w, i) => (
              <span key={i} data-cta-word className="inline-block overflow-hidden pb-[0.08em] align-top whitespace-pre">
                <span className={`inline-block ${w === "project" ? "text-glow-fill" : ""}`}>{w} </span>
              </span>
            ))}
            <br />
            {["Let's", "build", "it", "together."].map((w, i) => (
              <span key={i} data-cta-word className="inline-block overflow-hidden pb-[0.08em] align-top whitespace-pre">
                <span className="inline-block text-accent">{w} </span>
              </span>
            ))}
          </h2>

          <p
            data-cta-sub
            className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.2vw,1.25rem)] leading-relaxed text-muted"
          >
            I&apos;m open to freelance work and full-time roles. Tell me about your idea and I&apos;ll get back to you within a day.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              data-cta-btn
              data-magnet
              href="#contact-form"
              onClick={scrollToForm}
              className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-text px-8 text-base font-medium text-bg transition-colors duration-500 hover:text-text focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 md:h-16 md:px-10 md:text-lg"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-glow transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-y-100" />
              <span className="relative">Start a project</span>
              <svg viewBox="0 0 24 24" className="relative h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              data-cta-btn
              data-magnet
              href={`mailto:${site.email}`}
              className="inline-flex h-14 items-center rounded-full border border-line px-8 text-base text-text transition-colors duration-500 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 md:h-16 md:px-10 md:text-lg"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>

      {/* ── Marquee ────────────────────────────────────────────────────── */}
      <div data-marquee-wrap className="relative mt-20 border-y border-line py-5 md:mt-28" aria-hidden="true">
        <div data-marquee className="flex w-max whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {marquee.map((w, i) => (
                <span key={i} className="flex items-center text-[clamp(1.4rem,2.6vw,2.6rem)] font-medium tracking-tight uppercase">
                  <span className={`px-6 ${i % 2 ? "text-accent" : "text-text/40"}`}>{w}</span>
                  <span className="h-2 w-2 rounded-full bg-glow" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact form ───────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1920px] px-6 pt-24 pb-16 sm:px-10 md:pt-32 md:pb-24 lg:px-[6.5vw]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-[6vw] xl:grid-cols-[1fr_1.8fr]">

          {/* Left: label + description */}
          <div className="flex flex-col justify-center">
            <p className="text-[clamp(0.8rem,0.85vw,1rem)] font-medium tracking-[0.35em] text-accent uppercase">Contact</p>
            <h3 className="mt-4 text-[clamp(2rem,3.2vw,3.4rem)] leading-[1.05] font-medium tracking-tight">
              Send me
              <br />a message
            </h3>
            <p className="mt-6 max-w-sm leading-relaxed text-muted">
              Based in {site.location}, working with clients everywhere. Prefer email? Write to{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-text underline decoration-text/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {site.email}
              </a>
              .
            </p>
          </div>

          {/* Right: form card */}
          <form
            ref={form}
            id="contact-form"
            data-form
            onSubmit={onSubmit}
            noValidate
            className="relative rounded-3xl border border-line bg-[#120d16]/80 p-7 shadow-[0_30px_80px_-40px_rgba(127,64,255,0.6)] backdrop-blur-md md:p-10"
          >
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-glow/25 blur-[80px]" />

            {status === "sent" ? (
              <div className="relative flex min-h-[22rem] flex-col items-center justify-center text-center" role="status">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-bg">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" className="tm-draw" />
                  </svg>
                </span>
                <p className="mt-6 text-2xl font-medium">Thanks, your message is on its way.</p>
                <p className="mt-2 text-muted">I&apos;ll reply to you soon.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-sm text-accent underline-offset-4 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="grid gap-8 sm:grid-cols-2">
                  {fields.map((f) => (
                    <Field key={f.id} {...f} />
                  ))}
                </div>
                <div className="mt-8">
                  <Field id="message" label="Tell me about your project" textarea />
                </div>

                {/* Honeypot: hidden from people, filled only by bots */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-muted" aria-live="polite">
                    {status === "error" ? <span className="text-[#ff9ab5]">{error}</span> : "I usually reply within 24 hours."}
                  </p>
                  <button
                    ref={button}
                    type="submit"
                    data-submit
                    data-magnet
                    disabled={status === "sending"}
                    className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-accent px-8 font-medium text-bg transition-[background-color,opacity] duration-500 hover:bg-text disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
                  >
                    <span className={`transition-transform duration-500 ${status === "sending" ? "-translate-y-10" : ""}`}>Send message</span>
                    <span className={`absolute left-8 transition-transform duration-500 ${status === "sending" ? "translate-y-0" : "translate-y-10"}`} aria-hidden={status !== "sending"}>
                      Sending…
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-5 w-5 transition-transform duration-500 ${status === "sending" ? "translate-x-10 -translate-y-10" : "group-hover:translate-x-1 group-hover:-translate-y-1"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M4 20L20 4M9 4h11v11" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
}

/** Floating-label field with an underline that glows when focused. */
function Field({ id, label, type = "text", autoComplete, textarea }: FieldProps) {
  const shared =
    "peer w-full border-0 bg-transparent pt-6 pb-2 text-lg text-text outline-none placeholder-transparent autofill:shadow-[inset_0_0_0_1000px_#120d16]";
  return (
    <div data-field className="group relative">
      {textarea ? (
        <textarea id={id} name={id} rows={4} required placeholder={label} className={`${shared} resize-none`} />
      ) : (
        <input id={id} name={id} type={type} required autoComplete={autoComplete} placeholder={label} className={shared} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-6 left-0 origin-left text-lg text-muted transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] peer-focus:top-0 peer-focus:scale-[0.72] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.72]"
      >
        {label}
      </label>
      <span data-line aria-hidden="true" className="absolute right-0 bottom-0 left-0 h-px origin-left bg-text/20" />
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-0 left-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-glow to-accent shadow-[0_0_12px_rgba(127,64,255,0.7)] transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] peer-focus:scale-x-100"
      />
    </div>
  );
}
