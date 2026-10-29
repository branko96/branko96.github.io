export type Lang = 'en' | 'es';

export const LANGS: Lang[] = ['en', 'es'];

export type LogTone = 'ok' | 'warn' | 'info' | 'crit';

export interface LogLine {
  text: string;
  tone: LogTone;
}

export interface LoopStage {
  id: string;
  name: string;
  summary: string;
  /** Quién actúa en esta etapa: un modelo o "sin modelo". */
  actor: string;
  guardrail: string;
  onFailure: string;
  log: LogLine[];
  human?: boolean;
}

/** Falla inyectable en el Loop: reemplaza el log de una etapa y muestra cómo se recupera. */
export interface LoopScenario {
  id: string;
  label: string;
  stage: string;
  log: LogLine[];
  recovered: string;
}

export interface CraftItem {
  id: string;
  title: string;
  hook: string;
  points: string[];
  evidence: string;
}

export interface Project {
  name: string;
  image: string;
  tagline: string;
  body: string;
  stack: string;
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
    title: string[];
    lead: string;
    proof: string;
    photoAlt: string;
    byline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    pr: {
      repo: string;
      number: string;
      title: string;
      branch: string;
      checks: { name: string; detail: string }[];
      stats: string;
      running: string;
      awaiting: string;
      merge: string;
      merged: string;
      mergedNote: string;
      note: string;
    };
  };
  proof: { label: string; items: { value: string; text: string }[] };
  loop: {
    title: string;
    intro: string;
    runLabel: string;
    runNote: string;
    actorLabel: string;
    guardrailLabel: string;
    failureLabel: string;
    humanBadge: string;
    scenarioLabel: string;
    cleanRun: string;
    stages: LoopStage[];
    scenarios: LoopScenario[];
  };
  craft: {
    title: string;
    intro: string;
    evidenceLabel: string;
    open: string;
    close: string;
    items: CraftItem[];
  };
  work: {
    title: string;
    intro: string;
    imageAlt: string;
    projects: Project[];
    kit: { name: string; href: string; body: string; skills: string[]; link: string };
  };
  mobile: {
    title: string;
    intro: string;
    apps: MobileApp[];
  };
  experience: {
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
    title: string;
    text: string;
    email: string;
    links: { label: string; href: string }[];
    cv: string;
    overlap: {
      title: string;
      here: string;
      you: string;
      /** Usa {h} para las horas de solapamiento. */
      hours: string;
      none: string;
      legend: string;
      fallback: string;
    };
    footer: {
      tagline: string;
      onPage: string;
      elsewhere: string;
      files: string;
      cv: string;
      otherLang: string;
      top: string;
      colophon: string;
    };
  };
}
