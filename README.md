# Billal Hosen Shamim · Portfolio

Personal portfolio built with **Next.js 15 (App Router)**, **Tailwind CSS 4**, **GSAP + ScrollTrigger**, **Lenis** smooth scrolling and a **React Three Fiber** Rubik's cube intro.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run images    # convert PNG/JPG in assets-src/ to WebP in public/images/
```

## Editing content

All text lives in `src/data/`, so you never need to touch components:

| File | What it controls |
| --- | --- |
| `site.ts` | Name, tagline, intro, email, socials, SEO title/description, nav links |
| `about.ts` | Portrait, bio paragraphs, highlight cards |
| `skills.ts` | Skill groups (Front-end, Back-end, Tools, AI workflow) |
| `process.ts` | The 4 process steps |
| `projects.ts` | Project cards (image or `video`, tags, live/code links) |
| `contact.ts` | Contact heading, text, subject options |

**Images:** drop PNG/JPG files in `assets-src/` (for example `assets-src/projects/deenhub.png`) and run `npm run images`. The current project images are placeholders; replace them with real screenshots using the same file names.
**Resume:** replace `public/documents/resume.pdf`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`: free key from [web3forms.com](https://web3forms.com) for the contact form.
- `NEXT_PUBLIC_SITE_URL`: optional, your production URL (used for Open Graph links and robots.txt).

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repository (framework is detected as Next.js).
2. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (and optionally `NEXT_PUBLIC_SITE_URL`) under Environment Variables.
3. Click **Deploy**. Every push to the main branch redeploys automatically.

## How it works

- **Preloader** (`src/components/preloader`): counter follows the slower of real loading (page, fonts, the 3D chunk and its textures via drei's `useProgress`) and a 2.5 s minimum. At 100% the 27 cubies fly toward the camera and the overlay fades. "Skip intro" (or Escape) jumps straight to the hero. `sessionStorage` makes it play once per visit. Devices without hardware WebGL (or with Data Saver on) get a lightweight CSS cube instead; add `?scene=webgl` to the URL to force the 3D version.
- **Smooth scroll** (`src/components/providers/SmoothScroll.tsx`): Lenis runs on GSAP's ticker and calls `ScrollTrigger.update` on every scroll.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, the intro, Lenis and all GSAP animations are off, and Projects falls back to the swipe carousel.
- **Projects:** pinned horizontal scroll (`scrub: 1`) from 768px up; a native scroll-snap carousel below that.
