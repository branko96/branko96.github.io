---
name: Branko Ottavianelli · Cobalt
colors:
  ground: "#060a18"
  ground-raised: "#0c1226"
  ink: "#e2e8ff"
  ink-dim: "rgb(226 232 255 / 0.72)"
  muted: "rgb(226 232 255 / 0.55)"
  accent: "#7aa2ff"
  on-accent: "#060a18"
  field: "#1f3fd6"
  on-field: "#f2f5ff"
  term-bg: "#03060f"
  ok: "#7ee2b8"
  warn: "#f5c76b"
  crit: "#ff8a9a"
  light-ground: "#f5f7fc"
  light-ink: "#0f1424"
  light-ink-dim: "#434b63"
  light-accent: "#2347c8"
typography:
  display-xl:
    fontFamily: Archivo
    fontSize: clamp(2.5rem, 6.4vw, 6rem)
    fontWeight: "800"
    lineHeight: "0.95"
    letterSpacing: -0.035em
    fontVariation: "wdth 125"
  display-lg:
    fontFamily: Archivo
    fontSize: clamp(2.2rem, 4.6vw, 4.4rem)
    fontWeight: "800"
    lineHeight: "0.95"
    letterSpacing: -0.035em
    fontVariation: "wdth 125"
  heading:
    fontFamily: Archivo
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 30px
    letterSpacing: -0.01em
  lead:
    fontFamily: Archivo
    fontSize: 20px
    fontWeight: "400"
    lineHeight: 32px
  body:
    fontFamily: Archivo
    fontSize: 17px
    fontWeight: "400"
    lineHeight: 27px
  small:
    fontFamily: Archivo
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: "400"
    lineHeight: 24px
rounded:
  control: 9999px
  surface: 16px
  field: 28px
spacing:
  unit: 4px
  container-max: 76rem
  margin: clamp(1rem, 4vw, 2.5rem)
  section: clamp(6rem, 14vh, 11rem)
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    height: 56px
    padding: 28px
  button-on-field:
    backgroundColor: "{colors.on-field}"
    textColor: "{colors.field}"
    rounded: "{rounded.control}"
    height: 56px
  chip-on-field:
    backgroundColor: "rgb(242 245 255 / 0.12)"
    textColor: "{colors.on-field}"
    rounded: "{rounded.control}"
    height: 44px
  surface-raised:
    backgroundColor: "{colors.ground-raised}"
    rounded: "{rounded.surface}"
    padding: 28px
  section-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.on-field}"
    rounded: "{rounded.field}"
  terminal:
    backgroundColor: "{colors.term-bg}"
    textColor: "#ecebf2"
    typography: "{typography.code}"
    rounded: "{rounded.surface}"
---

## Overview

The portfolio of a senior React Native and AI engineer who builds agent harnesses. The page is written for hiring: a recruiter or hiring manager should get the role, seniority and proof in the first screen, then can go as deep into the harness as they like.

**Idea:** on this page, the harness's own output (a pull request, a run log, a bot report) becomes the imagery. The hero is a pull request whose checks complete on their own and that the visitor merges. The loop section is a run you scroll through and can break. The mobile section is the bot reporting to a phone. The page itself is a feature branch, drawn in the left margin, that merges into main at the contact.

**Mode:** Persuade. The visitor is a recruiter, hiring manager or tech lead deciding whether to interview. Success is an email or a downloaded CV.

**Scene:** read on a laptop during the working day, often late in someone else's time zone, so dark by default with a full light theme.

**Lineage:** inherits the motion discipline of web-quality-kit (exponential easing, reveals that never hide content without JS, reduced-motion fallbacks). Deliberately not the Oblivion look: no violet glow, no particle isotype, no shader blob, no serif accent.

## Colors

Strategy: **committed**. Cobalt carries whole regions, never sprinkled.

- **Ground (#060a18)** is ink navy, not black. Raised surfaces step one tone up (#0c1226); surfaces are separated by tone, not lines or glows.
- **Field (#1f3fd6)** is the identity. Two sections are drenched in it (the loop and the contact), with rounded 28px corners and a clip-path wipe on entry. On a field, text uses `on-field` at full or 92% strength; secondary text never drops below 86%.
- **Accent (#7aa2ff)** is for the primary action and the active state only.
- **Terminal colours** (`ok`, `warn`, `crit`) belong to log output and status, and stay fixed across palettes.
- **Light theme:** ground #f5f7fc, ink #0f1424, accent #2347c8. The field stays cobalt.

The palette lab (`?lab`) keeps five alternates for comparison; Cobalt is the published one (`DEFAULT_PALETTE` in `lib/palettes.ts`, the single source for all token CSS).

## Typography

One family, **Archivo**, used along its width axis:

- **Display** is Archivo at `wdth 125`, weight 800, tracking −0.035em, leading 0.95. It narrows to `wdth 100` under 640px. Headlines stay within two lines on desktop; the hero size is computed from its longest line.
- **Text** is Archivo at normal width, 17px / 1.6, measure 56–66ch.
- **JetBrains Mono** appears only inside real code and interface fragments: run logs, branch names, skill commands.

No eyebrows, no small tracked capitals, no italic accent words, no gradient text.

## Layout

A 12-column grid inside a 76rem container with equal outer margins (`clamp(1rem, 4vw, 2.5rem)`). Sections are `clamp(6rem, 14vh, 11rem)` apart. Neighbouring sections never share a composition:

hero (role headline across; photo, lead and PR artefact split) → proof strip of four verified numbers on a raised field → mobile apps (sticky heading, two-column list) → drenched loop (sticky stage) → craft (sticky heading, four-row accordion) → Oblivion Tech studio work with real screenshots and the open-source kit → experience → drenched contact → footer.

## Elevation & Depth

Flat by default. Depth comes from tone steps (ground → raised → field). Shadows exist only on things that truly float: the PR artefact, the terminal, the phone, and the lab panel. All of these are interface fragments marked `data-ui`.

## Shapes

Controls are fully round (9999px). Surfaces use 16px corners, and drenched fields use 28px. Icons are authored SVG with a 2px stroke and round caps; the BO monogram uses the same stroke language.

## Components

- **PR artefact** (hero, the live element): repo and number, an Open/Merged pill, the title, the branch, and four checks whose spinners turn into checks through CSS delays (no JS needed, final state under reduced motion). A Merge button hands the human gate to the visitor.
- **Loop stage:** a sticky two-column stage on desktop. Stage rail with a progress bar on the left; scenario chips ("Break something"), terminal and stage facts on the right. On mobile, without JS or under reduced motion, it becomes an ordered list with every log and fact visible.
- **Branch rail:** a fixed SVG in the left margin (≥1536px). The feature line draws with scroll progress and gets a commit dot per section; the merge dot fills at the end.
- **Phone chat:** the harness bot's messages arrive one by one with a typing indicator when the phone enters view.
- **Overlap clock:** Bahía Blanca time and the visitor's time, two 24-hour bars of 9–18 working windows, and the shared hours.
- **Footer:** the BO monogram drawn stroke by stroke, columns for on-page links, elsewhere and files, plus a colophon bar and "back to top".

## Motion

- Easing: `--ease-premium` cubic-bezier(0.16, 1, 0.3, 1) for entrances, `--ease-micro` cubic-bezier(0.2, 0, 0.2, 1) for feedback.
- Durations: feedback 150ms, elements 420–600ms, sections 800–1100ms.
- Section entrances stagger heading, text and media by 60–90ms, rising 24px.
- One authored orchestration per scroll region: the hero checks, the loop run, the phone messages, the branch.
- Reduced motion keeps every piece of content and drops travel, loops and the sticky stage.

## Do's and Don'ts

- Do show the mechanism (a PR, a log, a message) instead of claiming it. Label illustrative material as illustrative.
- Do keep two drenched fields at most; the colour has to stay an event.
- Do theme the browser surfaces: selection, caret, scrollbar, focus ring.
- Don't add eyebrows, index numbers, gradient text, glows, glass or rows of identical icon cards.
- Don't use monospace outside code and interface fragments.
- Don't invent clients, quotes, metrics or logos.
- Don't let a headline run past two lines on desktop.

## Portfolio refinement · October 2026

- Audience is full-time hiring. The H1 is the CV title ("Senior full-stack & mobile engineer, AI-native"), the primary action is email, the secondary the CV. Title, metrics and dates match `cv/cv.html` exactly.
- Removed: the tools marquee, the "hire me" offers, the standalone skills chain, the bot phone and the always-on grid. The kit lives inside the studio section.
- The hero carries a real photo (`public/img/branko.jpg`) with name and current role.
- Studio screenshots reveal with a native view timeline when supported, with a static fallback. Hover zoom only runs with a fine pointer.
- The PR demonstration enables merge only after its checks finish; reduced motion makes the final checks immediately available.
- The harness sticky scene requires a desktop viewport at least 800px high; shorter screens use the complete readable list.
- Reveals observe newly inserted content. Reduced motion explicitly restores hidden content, including after a live preference change.
- `public/og.png` is rendered from `assets-src/og.html` (`npm run og`); the CV PDF from `cv/cv.html` (`npm run cv`).
