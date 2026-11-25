import { Award, Building2, HandHeart, Users } from 'lucide-react';
import {
  AWARDS_DETAILS,
  SPONSORSHIP_DETAILS,
  VOLUNTEER_RESPONSIBILITIES,
  WHO_SHOULD_ATTEND,
} from '@/data/datesAndFees';
import { CONTACT_INFO } from '@/data/conference';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { SecondaryLinkButton } from '@/components/Buttons/ActionButtons';
import { Reveal } from '@/components/animations/MotionPrimitives';

interface ParticipationSectionProps {
  theme: ThemeId;
}

export function ParticipationSection({ theme }: ParticipationSectionProps) {
  return (
    <section className="border-b border-border/15 py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="07"
            eyebrow="Participation, Awards & Support"
            title="Delegates, Recognition & Institutional Partnerships"
            theme={theme}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Who Should Attend */}
          <Reveal>
            <div className="theme-surface h-full p-6 sm:p-7">
              <div className="mb-4 flex items-center gap-2.5 text-accent">
                <Users className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold text-ink">
                  Who Should Attend
                </h3>
              </div>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {WHO_SHOULD_ATTEND.map((group) => (
                  <li
                    key={group}
                    className="theme-surface-muted px-3.5 py-2.5 text-sm font-medium text-ink"
                  >
                    {group}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Awards & Recognition */}
          <Reveal delay={0.06}>
            <div className="theme-surface flex h-full flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-4 flex items-center gap-2.5 text-accent">
                  <Award className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    Awards & Recognition
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {AWARDS_DETAILS.categories.map((award) => (
                    <div key={award.title} className="theme-surface-muted p-3.5">
                      <h4 className="text-sm font-bold text-ink">{award.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                        {award.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                {AWARDS_DETAILS.disclaimer}
              </p>
            </div>
          </Reveal>

          {/* Student Volunteers */}
          <Reveal>
            <div className="theme-surface h-full p-6 sm:p-7">
              <div className="mb-4 flex items-center gap-2.5 text-accent">
                <HandHeart className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold text-ink">
                  Student Volunteers
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                Student volunteers drawn from every NSIT department will support key
                conference operations across the two-day event:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {VOLUNTEER_RESPONSIBILITIES.map((role) => (
                  <span
                    key={role}
                    className="theme-pill bg-surface-muted/80 px-3 py-1.5 text-xs font-medium text-ink"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Sponsorship */}
          <Reveal delay={0.06}>
            <div className="theme-surface flex h-full flex-col justify-between p-6 sm:p-7">
              <div>
                <div className="mb-4 flex items-center gap-2.5 text-accent">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    Sponsorship & Institutional Participation
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">
                  ETIMS 2027 invites sponsorship and participation from{' '}
                  {SPONSORSHIP_DETAILS.invitees.join(', ')}.
                </p>

                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Collaboration Opportunities
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SPONSORSHIP_DETAILS.opportunities.map((opp) => (
                      <span
                        key={opp}
                        className="theme-pill bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
                      >
                        {opp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-border/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-ink-muted">
                  {SPONSORSHIP_DETAILS.note}
                </p>
                <SecondaryLinkButton
                  href={`mailto:${CONTACT_INFO.email}?subject=ETIMS%202027%20Sponsorship%20Enquiry`}
                  className="shrink-0 text-xs"
                >
                  Sponsorship Enquiry
                </SecondaryLinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

