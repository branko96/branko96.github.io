import type { FxHandle } from './core';

/**
 * Split de texto en palabras y revelado escalonado al entrar en vista (módulo
 * `text-reveal` del catálogo fx-effects). Respeta el marcado interno: una
 * `<em>` con la palabra de acento sigue siendo `<em>`, solo se parten sus
 * nodos de texto.
 *
 * La primera pintura tiene que ser legible: si el elemento ya está en pantalla
 * al montar, no se toca (esconderlo ahora sería un parpadeo). Solo se prepara
 * lo que todavía no se vio. El CSS de `.fx-word` vive con quien lo usa.
 */
export function createTextReveal(
  el: HTMLElement,
  { stagger = 55 }: { stagger?: number } = {},
): FxHandle {
  const noop: FxHandle = { destroy() {} };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return noop;
  }
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) return noop;

  const original = el.innerHTML;
  let index = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const parts = (node.textContent ?? '').split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
        continue;
      }
      const outer = document.createElement('span');
      outer.className = 'fx-word';
      const inner = document.createElement('span');
      inner.textContent = part;
      inner.style.setProperty('--fx-d', `${index++ * stagger}ms`);
      outer.append(inner);
      frag.append(outer);
    }
    node.replaceWith(frag);
  }
  el.dataset.fxSplit = '';

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      el.dataset.fxSplit = 'in';
      io.disconnect();
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  io.observe(el);

  return {
    destroy() {
      io.disconnect();
      el.innerHTML = original;
      delete el.dataset.fxSplit;
    },
  };
}
