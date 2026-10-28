# DESIGN.md

> Fuente de verdad visual del portafolio de Branko Ottavianelli. Generado desde
> `web-quality-kit/templates/DESIGN.md.template`: secciones 0–5 completadas,
> 6–9 son las reglas del kit sin cambios.

---

## 0. Identidad del proyecto

| Campo | Valor |
|---|---|
| Proyecto | branko96.github.io |
| Qué es | Portafolio de un Senior React Native & AI Engineer: harness de agentes, skills y 7 años de mobile, para recruiters y líderes técnicos |
| Tono | técnico, sereno, preciso |
| Referencias | oblivion-tech (paleta Abyss, tipografías, motion Premium); oblivion-ecommerce (sistema `data-reveal`); un log de CI real (la sección Loop se lee como una corrida) |
| Anti-referencias | Toolkits con selector de 7 pestañas (no copiamos el formato); portfolios con grilla de cards de vidrio y gradiente violeta en el hero |

Marca: monograma **BO** propio. Se hereda la huella visual de Oblivion (paleta, fuentes, curvas), no el isotipo.

---

## 1. Color

Tokens en `app/globals.css`. Oscuro por defecto; claro con `data-theme="light"`.

```css
/* oscuro (Abyss) */
--ground: #110221;  --ground-raised: #1a0632;
--ink: #e9ddff;     --ink-dim: rgb(233 221 255 / .72);  --muted: rgb(233 221 255 / .55);
--accent: #a98bff;  --accent-alt: #5f20c5;   /* alt solo en canvas/gradientes */
--line: rgb(233 221 255 / .12);  --line-strong: rgb(233 221 255 / .24);
--ok: #7ee2b8;  --warn: #f5c76b;  --crit: #ff8a9a;   /* solo en el terminal del Loop */

/* claro (Limestone) */
--ground: #f9f6fc;  --ground-raised: #ffffff;
--ink: #1d1a22;     --ink-dim: #494453;  --muted: #5d5768;
--accent: #993689;  --line: rgb(54 0 132 / .12);  --line-strong: rgb(54 0 132 / .24);
```

Contraste: ink/ground 14.9:1 (oscuro), 16.2:1 (claro); ink-dim ≥ 7:1; accent sobre ground ≥ 6:1.

---

## 2. Tipografía

| Rol | Familia | Uso |
|---|---|---|
| Display | Bricolage Grotesque (opsz, wdth) | H1, H2, cifras |
| Texto | Manrope | Lectura |
| Acento | Fraunces itálica SOFT 100 | Una palabra por titular, nunca párrafos |
| Mono | JetBrains Mono | Terminal del Loop, etiquetas de estado |

Escala: display XL `clamp(2.75rem, 7.5vw, 6.25rem)` / 0.92; H2 `clamp(2.1rem, 4.6vw, 3.6rem)` / 1;
cuerpo 1.0625rem / 1.65; medida máx. 60ch; eyebrow 0.8rem tracking 0.16em; cifras `tabular-nums`.

---

## 3. Espaciado y grilla

Escala `--s-1…--s-9` = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 px. Ancho máx. 72rem con gutter
`clamp(1rem, 4vw, 2.5rem)`. Padding de sección `clamp(4.5rem, 11vh, 8rem)` (`.section-py`).
Radio único 18px (pills: 999px). `gap` en vez de márgenes.

---

## 4. Movimiento

Personalidad **Premium** (motion-design).

| Capa | Duración | Curva |
|---|---|---|
| Micro (hover, foco, toggle) | 160ms | `--ease-micro` cubic-bezier(0.2,0,0.2,1) |
| Elemento (cards, expandir) | 420ms / spring 28·300 | `--ease-premium` cubic-bezier(0.16,1,0.3,1) |
| Sección (reveals) | 900ms | `--ease-premium` |
| Continuo (partículas, magnetic, backdrop) | `damp()` lerp exponencial | — |

Orquestación fuerte única: **el Loop** (stage sticky + terminal). El hero se lee en la primera
pintura (reveal por palabra en CSS, sin esperar JS). `prefers-reduced-motion` apaga partículas,
backdrop animado, magnetic, tilt y scrubbing; el Loop pasa a lista estática.

---

## 5. Presupuesto de performance

JS inicial ≤ 180KB gz · primera vista ≤ 1.5MB · LCP < 2.5s en 4G · Lighthouse ≥ 95 en las 4 categorías.
Partículas: 2.4k escritorio / 1.2k móvil, degradan a la mitad si < 32fps por 2s. Shader WebGL
low-power con fallback CSS `.abyss-glow`. Sin imágenes raster en la primera vista.

---

## 6. Qué NO hacer

Esta lista existe porque son las salidas por defecto de todo modelo cuando no hay dirección.
Si el resultado se parece a alguna, hay que rehacerlo:

- Crema cálido `#F4F1EA` + serif display + acento terracota.
- Negro casi puro con un único pop verde ácido o bermellón.
- Héroe con gradiente violeta-a-azul sobre blanco.
- Inter o Space Grotesk "porque es seguro".
- Emojis como marcadores de sección.
- Todo centrado.
- `border-radius` + sombra + borde en cada bloque (todo es una tarjeta).
- Marcadores numerados `01 / 02 / 03` en contenido que **no** es una secuencia.
- Barra de acento a la izquierda de cada tarjeta.
- Héroe de `100vh` que empuja la página entera fuera de la primera vista.

---

## 7. Estructura como información

Los recursos estructurales (numeración, epígrafes, divisores, etiquetas) tienen que
**codificar algo verdadero** del contenido, no decorarlo.

- Numerá solo lo que es una secuencia real (un proceso, una cronología).
- Una tarjeta implica "objeto separable". Si el contenido no lo es, no es una tarjeta.
- Borde, relleno, radio y sombra son cuatro señales distintas de separación.
  Gastalas por rol: levantá **una** cosa, no todas.

---

## 8. Accesibilidad (no negociable)

- Foco visible en todo control: `outline: 2px solid var(--accent); outline-offset: 3px`.
- Todo control interactivo es un `<button>` o `<a>` real, con `aria-pressed`/`aria-label`
  cuando el texto visible no alcanza.
- El canvas decorativo lleva `aria-hidden="true"` y nunca contiene información única.
- La página funciona sin JavaScript al nivel de leer el contenido.
- Objetivos táctiles ≥ 44×44 px.

---

## 9. Checklist antes de dar algo por terminado

- [ ] La primera pintura es legible sin scrollear ni esperar animaciones.
- [ ] No hay scroll horizontal a 360px de ancho.
- [ ] Los dos temas (claro/oscuro) están definidos por tokens, o el proyecto se
      compromete a uno solo de forma explícita.
- [ ] Ningún color vive únicamente dentro de un `@media` o `[data-theme]`.
- [ ] `prefers-reduced-motion` desactiva lo continuo.
- [ ] Los números del presupuesto de performance se midieron, no se estimaron.
- [ ] Ninguna decisión visual coincide con la sección 6.
