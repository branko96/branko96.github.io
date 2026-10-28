import { Archivo, JetBrains_Mono } from 'next/font/google';

// Una sola familia con eje de ancho: expandida y pesada para titulares, normal
// para lectura. La mono solo aparece en logs y código reales (DESIGN.md).
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap', preload: false });

export const fontVariables = `${archivo.variable} ${jetbrains.variable}`;
