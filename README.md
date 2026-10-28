# branko96.github.io

Portfolio of Branko Ottavianelli, Senior React Native & AI Engineer. One page, English and Spanish (`/en/`, `/es/`).

## Stack

- Next.js 15 static export (`output: 'export'`), React 19, TypeScript 6
- Tailwind CSS v4 (`@theme`, no config file) and `motion`
- Identity "Cobalt": Archivo (width axis) + JetBrains Mono for logs only, drenched cobalt fields, no glows or gradients
- Live pieces: a mergeable pull request (hero), a breakable agent run (loop), a bot chat on a phone, a scroll-drawn git branch, a time-zone overlap clock
- Visual source of truth: [`DESIGN.md`](DESIGN.md) in the [Google DESIGN.md format](https://github.com/google-labs-code/design.md)
- Palette lab: open any page with `?lab` to try the six palettes in `lib/palettes.ts` live (`[` `]` cycle, `L` light/dark). Visitors always see `DEFAULT_PALETTE`.

## Quality gates

```bash
node ~/.claude/skills/taste-skill/scripts/lint.mjs components app content   # 0 FAIL
node ~/.claude/skills/taste-skill/scripts/inspect.mjs http://localhost:4173/en/
```

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
