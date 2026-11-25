import { Clock } from 'lucide-react';
import { CONFERENCE_INFO } from '@/data/conference';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownProps {
  compact?: boolean;
}

export function Countdown({ compact = false }: CountdownProps) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(
    CONFERENCE_INFO.countdownTargetIso
  );

  const units = [
    { label: 'Days', value: String(days).padStart(2, '0') },
    { label: 'Hours', value: String(hours).padStart(2, '0') },
    { label: 'Mins', value: String(minutes).padStart(2, '0') },
    { label: 'Secs', value: String(seconds).padStart(2, '0') },
  ];

  return (
    <div
      className={`theme-surface ${compact ? 'p-4' : 'p-5 sm:p-6'}`}
      aria-label="Conference countdown timer"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Countdown to Conference
        </span>
        <span className="font-mono text-[11px] font-medium text-ink-muted">
          23 July 2027 (Tentative)
        </span>
      </div>

      {isPast ? (
        <p className="text-sm font-semibold text-ink">
          Conference dates have arrived — 23–24 July 2027 at NSIT, Bihta.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="theme-surface-muted flex flex-col items-center justify-center px-2 py-2.5 text-center sm:py-3"
            >
              <span className="font-mono text-xl font-bold tabular-nums tracking-tight text-ink sm:text-2xl">
                {unit.value}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted sm:text-[11px]">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

