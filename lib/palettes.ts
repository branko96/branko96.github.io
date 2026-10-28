/**
 * Paletas candidatas. Fuente única: de acá salen las reglas CSS (PaletteStyles)
 * y el panel de pruebas (PaletteLab, visible con ?lab). Cada paleta define el
 * tema oscuro, el claro y los tonos de marca que leen los canvas (shader y partículas).
 */
export interface ThemeTokens {
  ground: string;
  raised: string;
  ink: string;
  inkDim: string;
  muted: string;
  accent: string;
  accentInk: string;
  line: string;
  lineStrong: string;
}

export interface Palette {
  id: string;
  name: string;
  note: string;
  dark: ThemeTokens;
  light: ThemeTokens;
  /** Tonos de marca para gradientes y canvas (siempre sobre fondo oscuro). */
  brand: { deep: string; mid: string; glow: string };
  termBg: string;
  /** Campo de color pleno para secciones "drenched" y el texto que va encima. */
  field: string;
  onField: string;
}

const alpha = (rgb: string, a: number) => `rgb(${rgb} / ${a})`;

function dark(ground: string, raised: string, inkRgb: string, accent: string): ThemeTokens {
  return {
    ground,
    raised,
    ink: `rgb(${inkRgb})`,
    inkDim: alpha(inkRgb, 0.72),
    muted: alpha(inkRgb, 0.55),
    accent,
    accentInk: ground,
    line: alpha(inkRgb, 0.12),
    lineStrong: alpha(inkRgb, 0.24),
  };
}

function light(ground: string, ink: string, inkDim: string, muted: string, accent: string, lineRgb: string): ThemeTokens {
  return {
    ground,
    raised: '#ffffff',
    ink,
    inkDim,
    muted,
    accent,
    accentInk: '#ffffff',
    line: alpha(lineRgb, 0.12),
    lineStrong: alpha(lineRgb, 0.24),
  };
}

export const PALETTES: Palette[] = [
  {
    id: 'abyss',
    name: 'Abyss',
    note: 'The Oblivion violet. Deep, nocturnal, recognisable.',
    dark: dark('#110221', '#1a0632', '233 221 255', '#a98bff'),
    light: light('#f9f6fc', '#1d1a22', '#494453', '#5d5768', '#993689', '54 0 132'),
    brand: { deep: '#4e1ca9', mid: '#5f20c5', glow: '#a98bff' },
    termBg: '#0b0115',
    field: '#5f20c5',
    onField: '#f3edff',
  },
  {
    id: 'phosphor',
    name: 'Phosphor',
    note: 'Terminal green on near-black. Reads as "engineer who runs agents".',
    dark: dark('#07110c', '#0d1a13', '227 245 233', '#b6f24a'),
    light: light('#f4f7f1', '#111a14', '#3e4a42', '#56625a', '#2f7a12', '17 60 30'),
    brand: { deep: '#0f4a2e', mid: '#1f7a4d', glow: '#b6f24a' },
    termBg: '#030a06',
    field: '#1f7a4d',
    onField: '#effaf3',
  },
  {
    id: 'ember',
    name: 'Ember',
    note: 'Warm charcoal and signal orange. Human, energetic, less "tech".',
    dark: dark('#120c09', '#1c1410', '246 233 223', '#ff7a3d'),
    light: light('#fbf8f5', '#1e1713', '#54473f', '#6b5d54', '#c2410c', '80 40 20'),
    brand: { deep: '#6e2412', mid: '#b2391b', glow: '#ff9a5c' },
    termBg: '#0a0604',
    field: '#b2391b',
    onField: '#fff3ec',
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    note: 'Ink navy, electric blue and full cobalt fields. The published identity.',
    dark: dark('#060a18', '#0c1226', '226 232 255', '#7aa2ff'),
    light: light('#f5f7fc', '#0f1424', '#434b63', '#5a627a', '#2347c8', '20 40 120'),
    brand: { deep: '#18308f', mid: '#2848d8', glow: '#7aa2ff' },
    termBg: '#03060f',
    field: '#1f3fd6',
    onField: '#f2f5ff',
  },
  {
    id: 'magenta',
    name: 'Magenta',
    note: 'The Oblivion magenta pushed forward. Bold, editorial, memorable.',
    dark: dark('#100612', '#1a0b1d', '251 228 243', '#ff6fc8'),
    light: light('#fcf6fa', '#1f1520', '#4f3f4d', '#675765', '#993689', '90 20 80'),
    brand: { deep: '#5c1a55', mid: '#993689', glow: '#ff6fc8' },
    termBg: '#09030a',
    field: '#993689',
    onField: '#fff0f9',
  },
  {
    id: 'signal',
    name: 'Signal',
    note: 'Graphite, off-white and one red. Swiss, sober, the most timeless.',
    dark: dark('#0c0c0d', '#161618', '242 242 240', '#ff4530'),
    light: light('#f6f5f2', '#111111', '#4a4a4a', '#626262', '#d42a17', '20 20 20'),
    brand: { deep: '#222226', mid: '#3a3a3f', glow: '#ff4530' },
    termBg: '#060607',
    field: '#c42614',
    onField: '#fff4f2',
  },
];

/** La paleta publicada. Cambiala acá cuando elijas una en el lab. */
export const DEFAULT_PALETTE = 'cobalt';

function themeRules(t: ThemeTokens) {
  return [
    `--ground:${t.ground}`,
    `--ground-raised:${t.raised}`,
    `--ink:${t.ink}`,
    `--ink-dim:${t.inkDim}`,
    `--muted:${t.muted}`,
    `--accent:${t.accent}`,
    `--accent-ink:${t.accentInk}`,
    `--line:${t.line}`,
    `--line-strong:${t.lineStrong}`,
  ].join(';');
}

/** CSS de todas las paletas, con la publicada también como default de :root. */
export function paletteCss(): string {
  return PALETTES.map((p) => {
    const sel = p.id === DEFAULT_PALETTE ? `:root,:root[data-palette='${p.id}']` : `:root[data-palette='${p.id}']`;
    const brand = `--color-abyss:${p.dark.ground};--color-violet-deep:${p.brand.deep};--color-violet:${p.brand.mid};--color-glow:${p.brand.glow};--term-bg:${p.termBg};--field:${p.field};--on-field:${p.onField}`;
    const lightSel = sel
      .split(',')
      .map((s) => `${s}[data-theme='light']`)
      .join(',');
    return `${sel}{${themeRules(p.dark)};${brand}}${lightSel}{${themeRules(p.light)}}`;
  }).join('');
}
