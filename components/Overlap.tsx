'use client';

import { useEffect, useState } from 'react';
import type { Content } from '@/content';

const HOME_TZ = 'America/Argentina/Buenos_Aires';
const START = 9;
const END = 18;

/** Diferencia de una zona horaria con UTC, en horas, para este instante. */
function offsetHours(tz: string, at: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
  return Math.round((asUtc - at.getTime()) / 60000) / 60;
}

/** Tramos [inicio, fin) dentro de 0..24 para una jornada corrida `shift` horas. */
function segments(shift: number): [number, number][] {
  const a = (((START + shift) % 24) + 24) % 24;
  const b = a + (END - START);
  return b <= 24 ? [[a, b]] : [[a, 24], [0, b - 24]];
}

function overlapHours(shift: number) {
  let best = 0;
  for (const k of [-24, 0, 24]) {
    const a = START + shift + k;
    best = Math.max(best, Math.min(END, a + (END - START)) - Math.max(START, a));
  }
  return Math.max(0, best);
}

interface State {
  here: string;
  you: string;
  youTz: string;
  shift: number;
  now: number;
}

/**
 * El "live thing" del cierre: mi hora, la del visitante y cuántas horas laborales
 * compartimos, sobre una línea de 24 h en mi zona. Sin JS queda la frase de respaldo.
 */
export function Overlap({ copy, lang }: { copy: Content['contact']['overlap']; lang: string }) {
  const [s, setS] = useState<State | null>(null);

  useEffect(() => {
    const tick = () => {
      const at = new Date();
      const youTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const fmt = (tz: string) =>
        new Intl.DateTimeFormat(lang, { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(at);
      const home = offsetHours(HOME_TZ, at);
      const local = new Intl.DateTimeFormat('en-US', { timeZone: HOME_TZ, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(at)
        .reduce((acc, p) => (p.type === 'hour' ? acc + Number(p.value) : p.type === 'minute' ? acc + Number(p.value) / 60 : acc), 0);
      setS({
        here: fmt(HOME_TZ),
        you: fmt(youTz),
        youTz: youTz.split('/').pop()?.replace(/_/g, ' ') ?? youTz,
        shift: home - offsetHours(youTz, at),
        now: local,
      });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [lang]);

  const h = s ? overlapHours(s.shift) : 0;
  const pct = (x: number) => `${(x / 24) * 100}%`;

  return (
    <div className="rounded-2xl bg-on-field/10 p-6 md:p-7">
      <p className="text-lg font-bold">{copy.title}</p>
      {!s ? (
        <p className="mt-3 leading-relaxed text-ink-dim">{copy.fallback}</p>
      ) : (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-ink-dim">{copy.here}</dt>
              <dd className="display mt-1 text-[2.4rem] tabular-nums">{s.here}</dd>
            </div>
            <div>
              <dt className="truncate text-sm text-ink-dim">
                {copy.you} · {s.youTz}
              </dt>
              <dd className="display mt-1 text-[2.4rem] tabular-nums">{s.you}</dd>
            </div>
          </dl>

          {/* Línea de 24 h en hora de Bahía Blanca */}
          <div className="mt-6 space-y-2" aria-hidden="true">
            {[segments(0), segments(s.shift)].map((segs, row) => (
              <div key={row} className="relative h-3 rounded-full bg-on-field/12">
                {segs.map(([a, b]) => (
                  <span
                    key={a}
                    className={row === 0 ? 'absolute inset-y-0 rounded-full bg-on-field' : 'absolute inset-y-0 rounded-full bg-on-field/55'}
                    style={{ left: pct(a), width: pct(b - a) }}
                  />
                ))}
                {row === 0 && (
                  <span className="absolute -inset-y-1.5 w-0.5 rounded bg-[#f5c76b]" style={{ left: pct(s.now) }} />
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 font-semibold">{h > 0 ? copy.hours.replace('{h}', String(h)) : copy.none}</p>
          <p className="mt-1 text-sm text-ink-dim">{copy.legend}</p>
        </>
      )}
    </div>
  );
}
