# Bibhu Prasad Mahapatra — Portfolio

Immersive portfolio built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, React Three Fiber, GSAP (ScrollTrigger), Framer Motion, Lenis and Swiper.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

| Path | What |
| --- | --- |
| `src/lib/data.ts` | All content: profile, links, technologies, projects, timeline, services, education |
| `src/app/globals.css` | Design tokens (`@theme`) and utilities (`label`, `glass`, `text-outline`, `text-aura`, `container-x`) |
| `src/components/SmoothScroll.tsx` | Lenis driven by GSAP's ticker, synced with ScrollTrigger |
| `src/components/hero/` | Hero scene + R3F "Digital Core" (particles, orbits, scroll camera) |
| `src/components/Galaxy.tsx` | Interactive technology orbit network |
| `src/components/projects/` | Swiper project experience, per-project environments, case study + architecture diagram |
| `src/app/work/[slug]` | Statically generated case-study pages |

## Before publishing

- Set real `github`, `linkedin` URLs in `src/lib/data.ts`, and add `public/resume.pdf`.
- Add `public/portrait.jpg` and project screenshots (`public/work/<slug>-1.png`), then wire them in `Profile.tsx` / `CaseStudy.tsx`.
- Case-study text in `data.ts` is a draft — confirm details for each project.
- Live Demo / GitHub buttons in `CaseStudy.tsx` point to `#`.
