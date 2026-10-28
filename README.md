# branko96.github.io

Portfolio of Branko Ottavianelli, Senior React Native & AI Engineer. One page, English and Spanish (`/en/`, `/es/`).

## Stack

- Next.js 15 static export (`output: 'export'`), React 19, TypeScript 6
- Tailwind CSS v4 (`@theme`, no config file) and `motion`
- Effects ported from web-quality-kit (`fx/`): WebGL gradient backdrop, BO particle monogram, magnetic CTAs, text reveal, `data-reveal`/`data-glow`/`data-tilt`
- Visual source of truth: [`DESIGN.md`](DESIGN.md)

## Commands

```bash
npm install
npm run dev        # http://localhost:3000/en/
npm run build      # static site in out/
npm run serve      # serve out/ on :4173
```

## Content

All copy lives in `content/en.ts` and `content/es.ts` (typed by `content/types.ts`). The CV is `public/Branko-Ottavianelli-CV.pdf`.

## Deploy

Every push to `master` runs `.github/workflows/pages.yml` and publishes `out/` to GitHub Pages.
One-time setup: repository Settings → Pages → Source: **GitHub Actions**.
