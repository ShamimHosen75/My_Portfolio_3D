import Image from "next/image";
import { TiltCard } from "@/components/ui/TiltCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/data/about";
import { site } from "@/data/site";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <TiltCard className="mx-auto w-full max-w-sm rounded-3xl lg:mx-0 lg:max-w-none">
          <figure className="overflow-hidden rounded-3xl border border-line bg-surface p-3">
            <Image
              src={about.portrait.src}
              alt={about.portrait.alt}
              width={about.portrait.width}
              height={about.portrait.height}
              sizes="(min-width: 1024px) 40vw, 384px"
              className="h-auto w-full rounded-2xl object-cover"
            />
            <figcaption className="flex items-center justify-between px-2 pt-4 pb-1 text-sm">
              <span className="font-semibold">{site.name}</span>
              <span className="text-muted">{site.location}</span>
            </figcaption>
          </figure>
        </TiltCard>

        <div className="flex flex-col">
          <SectionHeading
            id="about-title"
            eyebrow="About"
            title={about.heading}
          />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {about.highlights.map((h) => (
              <li
                key={h.value}
                className="rounded-2xl border border-line bg-surface p-6"
              >
                <p className="text-2xl font-bold text-accent">{h.value}</p>
                <p className="mt-1 text-sm text-muted">{h.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
