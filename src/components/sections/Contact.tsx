import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { contact } from "@/data/contact";
import { site } from "@/data/site";

const icons = {
  github: (
    <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  ),
};

export function Contact() {
  const socials = [site.socials.github, site.socials.linkedin];
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title={contact.heading}
          />
          <p className="mt-6 max-w-md text-lg text-muted">{contact.text}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block text-xl font-semibold break-all text-accent underline decoration-accent/40 underline-offset-8 transition-colors hover:decoration-accent sm:text-2xl"
          >
            {site.email}
          </a>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 shrink-0 fill-current"
                    aria-hidden="true"
                  >
                    {s.label === "GitHub" ? icons.github : icons.linkedin}
                  </svg>
                  <span className="min-w-0">
                    <span className="block font-semibold">{s.label}</span>
                    <span className="block truncate text-sm text-muted">
                      {s.handle}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-auto text-muted transition-colors group-hover:text-accent"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
