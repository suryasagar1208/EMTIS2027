import { AlertCircle, CalendarCheck2 } from 'lucide-react';
import type { ImportantDateItem } from '@/types/conference';
import { StaggerGroup, StaggerItem } from '@/components/animations/MotionPrimitives';

interface TimelineProps {
  items: ImportantDateItem[];
  disclaimer: string;
}

export function Timeline({ items, disclaimer }: TimelineProps) {
  return (
    <div className="space-y-6">
      {/* Provisional Dates Disclaimer */}
      <div
        role="note"
        className="theme-surface-muted flex items-start gap-3 p-4 text-sm text-ink"
      >
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-accent-secondary"
          aria-hidden="true"
        />
        <p className="leading-relaxed">
          <span className="font-semibold">Provisional Schedule Notice:</span>{' '}
          {disclaimer}
        </p>
      </div>

      {/* Responsive Timeline Grid / Vertical List */}
      <StaggerGroup className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <StaggerItem key={item.id}>
            <div
              className={`theme-surface flex h-full flex-col justify-between p-5 ${
                item.isPrimary ? 'border-accent/55 bg-accent/[0.06]' : ''
              }`}
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-accent">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {item.isPrimary ? (
                    <span className="theme-pill inline-flex items-center gap-1 bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      <CalendarCheck2 className="h-3 w-3" aria-hidden="true" />
                      Main Event
                    </span>
                  ) : (
                    <span className="theme-pill bg-surface-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
                      Milestone
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-base font-semibold leading-snug text-ink sm:text-lg">
                  {item.activity}
                </h3>

                {item.statusNote && (
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                    {item.statusNote}
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-border/15 pt-3">
                <p className="font-mono text-sm font-bold text-accent sm:text-base">
                  {item.date}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}

