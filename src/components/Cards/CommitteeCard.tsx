import { User } from 'lucide-react';
import type { CommitteeMember } from '@/types/conference';
import { InteractiveSurface } from '@/components/animations/MotionPrimitives';

interface CommitteeCardProps {
  member: CommitteeMember;
  variant?: 'featured' | 'compact' | 'advisory';
}

export function CommitteeCard({ member, variant = 'featured' }: CommitteeCardProps) {
  const isCompact = variant === 'compact';

  return (
    <InteractiveSurface className="h-full">
      <article
        className={`theme-surface theme-card-interactive flex h-full ${
          isCompact
            ? 'flex-col items-center p-4 text-center sm:p-5'
            : 'flex-row items-center gap-4 p-4 sm:p-5'
        }`}
      >
        <div
          className={`shrink-0 overflow-hidden rounded-full border border-border/25 bg-surface-muted/80 ${
            isCompact ? 'h-20 w-20' : 'h-16 w-16 sm:h-20 sm:w-20'
          }`}
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={`${member.name} — ${member.role}`}
              loading="lazy"
              width={160}
              height={160}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center bg-accent/10 text-accent"
              aria-label={`Portrait placeholder for ${member.name}`}
              title="Photograph not provided in official brochure"
            >
              <User className="h-6 w-6 opacity-75" aria-hidden="true" />
              <span className="mt-0.5 font-mono text-[10px] font-semibold tracking-wider">
                {member.initials}
              </span>
            </div>
          )}
        </div>

        <div className={isCompact ? 'mt-3' : 'min-w-0 flex-1'}>
          <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
            {member.role}
          </span>
          <h3 className="mt-0.5 font-serif text-base font-semibold leading-snug text-ink sm:text-lg">
            {member.name}
          </h3>
          {member.designation && (
            <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
              {member.designation}
            </p>
          )}
          <p className="mt-0.5 text-xs font-medium text-ink/80">
            {member.affiliation}
          </p>
        </div>
      </article>
    </InteractiveSurface>
  );
}

