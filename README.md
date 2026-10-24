# Billal Hosen Shamim · Portfolio

Animated personal portfolio built with **Next.js 15 (App Router)**, **Tailwind CSS 4**, **GSAP + ScrollTrigger**, **Lenis** smooth scrolling, **React Three Fiber** and **Rapier** physics.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run images    # convert PNG/JPG in assets-src/ to WebP in public/images/
```

## What's on the page

1. **Loader**: light screen with a scrolling "A Creative Developer" marquee and a `LOADING xx%` pill tied to real loading (fonts, page and 3D scene, at least 2.5s). It plays once per browser session; press Escape to skip.
2. **Hero**: a 3D clay character whose head follows the cursor, the name on the left and "A Creative WEB / MERN / AI Developer" on the right.
3. **About** and **What I do**: the camera moves with the scroll, then pulls back to the character typing at a desk, with accordion skill cards.
4. **My career & experience**: timeline with a glowing line that grows as you scroll.
5. **My Work**: project columns that scroll sideways while the section is pinned (swipe on phones).
6. **My Techstack**: logo balls you can push around with the cursor.
7. **Contact**: email, location, social links and credits.

Phones, low-power devices and browsers without a GPU get still images of the character instead of the live 3D scene, and anyone with "reduce motion" turned on gets the page without the loader or scroll animations. Add `?scene=webgl` to the URL to force the 3D scene.

## Editing content

All text lives in `src/data/`:

| File | What it controls |
| --- | --- |
| `site.ts` | Name, hero lines and cycling words, role, email, location, resume link, socials, SEO, loader words |
| `about.ts` | About text and the "What I do" cards |
| `career.ts` | Career and education timeline |
| `projects.ts` | Projects in "My Work" (image, tools, live and code links) |
| `skills.ts` | Logos in "My Techstack" (from the `simple-icons` package) |

**Project images:** drop PNG/JPG screenshots in `assets-src/projects/` using the same names as in `projects.ts` (for example `deenhub.png`) and run `npm run images`. The current images are placeholders.
**Testimonials:** `src/data/testimonials.ts` holds sample quotes; replace them with real ones.
**Resume:** replace `public/documents/resume.pdf`.
**Character stills:** `public/images/character-hero.webp` and `character-desk.webp` are renders of the 3D scene used as the fallback.

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repository (Next.js is detected automatically).
2. Under Environment Variables add `RESEND_API_KEY` (free key from [resend.com](https://resend.com)) so the contact form emails you. Without it the form opens the visitor's mail app instead. `NEXT_PUBLIC_SITE_URL` and `CONTACT_FROM` are optional.
3. Click **Deploy**. Every push to `main` redeploys automatically.
