import {
  Atom,
  BookOpen,
  Briefcase,
  Building2,
  ChevronRight,
  Cog,
  Cpu,
  Radio,
  Zap,
} from 'lucide-react';
import type { TechnicalTrack } from '@/types/conference';
import { InteractiveSurface } from '@/components/animations/MotionPrimitives';

const TRACK_ICONS = {
  cpu: Cpu,
  building: Building2,
  zap: Zap,
  cog: Cog,
  radio: Radio,
  atom: Atom,
  briefcase: Briefcase,
  bookOpen: BookOpen,
};

interface TrackCardProps {
  track: TechnicalTrack;
  onExplore: (track: TechnicalTrack) => void;
}

export function TrackCard({ track, onExplore }: TrackCardProps) {
  const Icon = TRACK_ICONS[track.iconName];
  const previewTopics = track.topics.slice(0, 4);
  const remainingCount = track.topics.length - previewTopics.length;

  return (
    <InteractiveSurface className="h-full">
      <article className="theme-surface theme-card-interactive flex h-full flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-accent">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-theme-sm bg-accent text-white">
                {track.code}
              </span>
              TRACK
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-theme-sm border border-border/20 bg-surface-muted/70 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <h3 className="font-serif text-lg font-semibold leading-snug text-ink sm:text-xl">
            {track.title}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {track.summary}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${track.title} topics`}>
            {previewTopics.map((topic) => (
              <li
                key={topic}
                className="theme-pill bg-surface-muted/70 px-2.5 py-1 text-xs font-medium text-ink"
              >
                {topic}
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="theme-pill bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                +{remainingCount} more
              </li>
            )}
          </ul>
        </div>

        <div className="mt-5 border-t border-border/15 pt-4">
          <button
            type="button"
            onClick={() => onExplore(track)}
            className="inline-flex min-h-[40px] w-full items-center justify-between text-sm font-semibold text-accent transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Explore track topics</span>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </article>
    </InteractiveSurface>
  );
}

