import { Bricolage_Grotesque, Fraunces, JetBrains_Mono, Manrope } from 'next/font/google';

// Titulares con carácter (grotesca con eje óptico), texto de lectura cálido,
// una serif suave en itálica para el acento y una mono para el terminal del Loop
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
});

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['italic'],
  axes: ['SOFT'],
  variable: '--font-fraunces',
  display: 'swap',
});

// La mono no aparece en la primera vista: sin preload
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap', preload: false });

export const fontVariables = `${bricolage.variable} ${manrope.variable} ${fraunces.variable} ${jetbrains.variable}`;
