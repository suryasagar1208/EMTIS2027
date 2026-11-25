import {
  ADVISORY_COMMITTEE,
  CO_CONVENORS,
  LEADERSHIP_COMMITTEE,
} from '@/data/committees';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { CommitteeCard } from '@/components/Cards/CommitteeCard';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/animations/MotionPrimitives';

interface CommitteesSectionProps {
  theme: ThemeId;
}

export function CommitteesSection({ theme }: CommitteesSectionProps) {
  return (
    <section id="committees" className="border-b border-border/15 py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="Governance & Academic Leadership"
            title="Organising & Advisory Committees"
            description="Guided by institutional leadership at Netaji Subhas Institute of Technology and distinguished academic advisors from IIT Patna, NIT Surathkal, GEC Munger, and GEC Bhojpur."
            theme={theme}
          />
        </Reveal>

        {/* Patrons & Convenor */}
        <div className="space-y-10">
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
              Patrons & Conference Convenor
            </h3>
            <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {LEADERSHIP_COMMITTEE.map((member) => (
                <StaggerItem key={member.id} className="h-full">
                  <CommitteeCard member={member} variant="featured" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Co-Convenors */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
              Co-Convenors
            </h3>
            <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {CO_CONVENORS.map((member) => (
                <StaggerItem key={member.id} className="h-full">
                  <CommitteeCard member={member} variant="compact" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* Advisory Committee */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-muted">
              Advisory Committee
            </h3>
            <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {ADVISORY_COMMITTEE.map((member) => (
                <StaggerItem key={member.id} className="h-full">
                  <CommitteeCard member={member} variant="advisory" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

