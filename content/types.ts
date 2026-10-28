export type Lang = 'en' | 'es';

export const LANGS: Lang[] = ['en', 'es'];

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export type LogTone = 'ok' | 'warn' | 'info';

export interface LoopStage {
  id: string;
  name: string;
  summary: string;
  /** Quién actúa en esta etapa: un modelo o "sin modelo". */
  actor: string;
  guardrail: string;
  onFailure: string;
  log: { text: string; tone: LogTone }[];
  human?: boolean;
}

export interface CraftItem {
  id: string;
  title: string;
  hook: string;
  points: string[];
  evidence: string;
}

export interface Skill {
  name: string;
  does: string;
}

export interface MobileApp {
  name: string;
  context: string;
  stat?: string;
  points: string[];
  stack: string[];
}

export interface Role {
  title: string;
  company: string;
  period: string;
  meta?: string;
  points: string[];
}

export interface Content {
  meta: { title: string; description: string; ogLocale: string };
  nav: {
    links: { href: string; label: string }[];
    cv: string;
    themeLight: string;
    themeDark: string;
    skip: string;
    menu: string;
    close: string;
    langLabel: string;
  };
  hero: {
    eyebrow: string;
    /** Líneas del H1; la palabra entre *asteriscos* va en Fraunces itálica. */
    title: string[];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    available: string;
  };
  stats: Stat[];
  loop: {
    eyebrow: string;
    title: string;
    intro: string;
    runLabel: string;
    runNote: string;
    actorLabel: string;
    guardrailLabel: string;
    failureLabel: string;
    humanBadge: string;
    stages: LoopStage[];
    alwaysOn: { title: string; items: { name: string; text: string }[] };
  };
  craft: {
    eyebrow: string;
    title: string;
    intro: string;
    evidenceLabel: string;
    open: string;
    close: string;
    items: CraftItem[];
  };
  skills: {
    eyebrow: string;
    title: string;
    intro: string;
    chain: Skill[];
    note: string;
    credit: string;
  };
  mobile: {
    eyebrow: string;
    title: string;
    intro: string;
    apps: MobileApp[];
  };
  experience: {
    eyebrow: string;
    title: string;
    roles: Role[];
    earlierTitle: string;
    earlier: string[];
    stackTitle: string;
    stack: { area: string; items: string }[];
    educationTitle: string;
    education: string[];
    certTitle: string;
    cert: { name: string; by: string; href: string; verify: string };
  };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    email: string;
    links: { label: string; href: string }[];
    cv: string;
    footer: string;
  };
}
