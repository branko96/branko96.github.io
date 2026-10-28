'use client';

import { useEffect, useRef, useState } from 'react';
import type { Content } from '@/content';
import { prefersReducedMotion } from '@/fx/core';
import { BOMark } from './BOMark';

// Fragmento de interfaz (data-ui): el teléfono flota y las burbujas llevan la sombra del chat
const DEVICE = 'mx-auto w-full max-w-[20rem] rounded-[2.6rem] bg-[#0b0f1c] p-2.5 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.6)]'; // taste-skill-ignore
const TYPING_DOT = 'size-1.5 animate-bounce rounded-full bg-[#9aa3bb]'; // taste-skill-ignore: indicador de escritura del chat
const BUBBLE = 'msg-in max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[0.82rem] leading-snug shadow-[0_1px_1px_rgb(0_0_0/0.06)]'; // taste-skill-ignore

/**
 * Un teléfono con el bot del harness reportando. El HTML trae todos los mensajes;
 * con JS y movimiento, llegan de a uno (con "escribiendo…") cuando el teléfono entra en vista.
 */
export function PhoneChat({ phone }: { phone: Content['mobile']['phone'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const total = phone.messages.length;
  const [shown, setShown] = useState(total);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setShown(0);
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        phone.messages.forEach((_, i) => {
          timers.push(window.setTimeout(() => setTyping(true), 300 + i * 1300));
          timers.push(
            window.setTimeout(() => {
              setTyping(false);
              setShown(i + 1);
            }, 1000 + i * 1300)
          );
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [phone.messages]);

  return (
    <figure className="m-0">
      <div
        ref={ref}
        data-ui
        className={DEVICE}
      >
        <div className="flex h-[29rem] flex-col overflow-hidden rounded-[2.1rem] bg-[#e9edf7] text-[#0f1424]">
          <div className="flex items-center gap-3 bg-white px-4 pb-3 pt-9">
            <span className="grid size-9 place-items-center rounded-full bg-field text-on-field">
              <BOMark className="h-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold">{phone.chat}</span>
              <span className="block text-xs text-[#4a5470]">{typing ? '…' : phone.status}</span>
            </span>
          </div>
          <ol className="flex flex-1 flex-col justify-end gap-2 px-3 pb-4" aria-live="polite">
            {phone.messages.slice(0, shown).map((m) => (
              <li key={m.title} className={BUBBLE}>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-bold text-[#1f3fd6]">{m.title}</span>
                  <span className="text-[0.68rem] text-[#5d6782]">{m.time}</span>
                </span>
                {m.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </li>
            ))}
            {typing && (
              <li aria-hidden="true" className="msg-in flex w-14 gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3">
                {[0, 1, 2].map((d) => (
                  <span key={d} className={TYPING_DOT} style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </li>
            )}
          </ol>
        </div>
      </div>
      <figcaption className="mx-auto mt-4 max-w-[22rem] text-center text-sm text-muted">{phone.caption}</figcaption>
    </figure>
  );
}
