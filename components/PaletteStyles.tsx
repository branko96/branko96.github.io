import { paletteCss } from '@/lib/palettes';

/** Inyecta las reglas de todas las paletas (generadas desde lib/palettes.ts). */
export function PaletteStyles() {
  return <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />;
}
