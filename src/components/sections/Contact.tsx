import { site } from "@/data/site";
import { ArrowUpRight } from "@/components/ui/icons";

/** Footer with the contact details and socials. */
export function Contact() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="relative pt-16 pb-16 md:pt-20 md:pb-20" aria-labelledby="contact-title">
      <div className="mx-auto max-w-[1920px] px-6 sm:px-10 lg:px-[6.5vw]">
        <h2 id="contact-title" className="text-[clamp(2.4rem,3.6vw,4rem)] leading-none font-medium tracking-tight uppercase">
          Contact
        </h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-2 md:grid-cols-[1.1fr_1fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted md:text-sm">Email</p>
              <a href={`mailto:${site.email}`} className="mt-1 inline-block text-sm hover:text-accent md:text-base">
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-xs text-muted md:text-sm">Location</p>
              <p className="mt-1 text-sm md:text-base">{site.location}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted md:text-sm">Social</p>
            <ul className="mt-2 space-y-1.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border-b border-text/40 pb-0.5 text-lg transition-colors hover:border-accent hover:text-accent md:text-xl"
                  >
                    {s.label}
                    <ArrowUpRight />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-lg leading-snug md:text-2xl">
              Designed and Developed
              <br />
              by <span className="text-accent uppercase">{site.name}</span>
            </p>
            <p className="mt-5 text-sm text-muted">© {year}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
