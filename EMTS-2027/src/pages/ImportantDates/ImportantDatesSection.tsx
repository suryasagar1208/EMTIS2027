import { DATES_DISCLAIMER, IMPORTANT_DATES } from '@/data/datesAndFees';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { Timeline } from '@/components/Timeline/Timeline';
import { Countdown } from '@/components/Countdown/Countdown';
import { Reveal } from '@/components/animations/MotionPrimitives';

interface ImportantDatesSectionProps {
  theme: ThemeId;
}

export function ImportantDatesSection({ theme }: ImportantDatesSectionProps) {
  return (
    <section id="dates" className="border-b border-border/15 py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                index="04"
                eyebrow="Important Dates"
                title="Conference Schedule & Deadlines"
                description="Key submission, notification, and registration milestones leading up to ETIMS 2027."
                theme={theme}
              />
            </Reveal>
          </div>
          <div className="mb-8 lg:col-span-5 lg:mb-12">
            <Reveal delay={0.08}>
              <Countdown compact />
            </Reveal>
          </div>
        </div>

        <Timeline items={IMPORTANT_DATES} disclaimer={DATES_DISCLAIMER} />
      </div>
    </section>
  );
}

