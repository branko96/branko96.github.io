'use client';

import { useEffect, useRef } from 'react';

interface Destroyable {
  destroy(): void;
}

/**
 * Monta un efecto sobre un <canvas> creado en cada montaje (StrictMode monta dos
 * veces, y un contexto WebGL perdido no se puede recuperar sobre el mismo nodo).
 */
export function useFreshCanvas<T extends Destroyable>(
  factory: (canvas: HTMLCanvasElement) => T | null,
  onReady?: (instance: T) => void
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const factoryRef = useRef(factory);
  const readyRef = useRef(onReady);
  factoryRef.current = factory;
  readyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let instance: T | null = null;
    let canvas: HTMLCanvasElement | null = null;

    // Los efectos son decorativos: arrancan cuando el hilo principal queda libre,
    // así no compiten con la hidratación ni con el LCP del hero.
    const mount = () => {
      canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      host.appendChild(canvas);
      instance = factoryRef.current(canvas);
      if (!instance) {
        canvas.remove();
        return;
      }
      readyRef.current?.(instance);
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(mount, { timeout: 1500 });

    return () => {
      cancelIdle(handle);
      instance?.destroy();
      canvas?.remove();
    };
  }, []);

  return hostRef;
}
