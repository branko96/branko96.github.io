import { en } from './en';
import { es } from './es';
import type { Content, Lang } from './types';

export * from './types';

const DICTS: Record<Lang, Content> = { en, es };

export function getContent(lang: Lang): Content {
  return DICTS[lang];
}

export function isLang(value: string): value is Lang {
  return value === 'en' || value === 'es';
}
