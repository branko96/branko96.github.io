import { cn } from '@/lib/cn';

/** Monograma BO: la B de trazo y la O como anillo que la toca. Mismo dibujo que public/bo-mark.svg. */
export function BOMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={11}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-7 w-auto', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path d="M26 22V98M26 22h22a18 18 0 0 1 0 36H26M26 58h26a20 20 0 0 1 0 40H26" />
      <circle cx="104" cy="60" r="27" />
    </svg>
  );
}
