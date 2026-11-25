import { Building, CheckCircle2, GraduationCap, Landmark, Presentation } from 'lucide-react';
import { ABOUT_CONFERENCE, ABOUT_INSTITUTE, CONFERENCE_INFO } from '@/data/conference';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/animations/MotionPrimitives';

interface AboutSectionProps {
  theme: ThemeId;
}

export function AboutSection({ theme }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="border-b border-border/15 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow="About Conference & Host Institute"
            title="Bridging Science, Engineering, Management & Humanities"
            description={ABOUT_CONFERENCE.overview}
            theme={theme}
          />
        </Reveal>

        {/* Conference Purpose & Activities */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="theme-surface h-full p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2.5 text-accent">
                <Presentation className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                  Conference Objectives
                </h3>
              </div>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ABOUT_CONFERENCE.objectives.map((item) => (
                  <li
                    key={item}
                    className="theme-surface-muted flex items-start gap-2.5 p-3.5 text-sm leading-relaxed text-ink"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border/15 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-ink-muted">
                  Two-Day Conference Activities
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ABOUT_CONFERENCE.activities.map((activity) => (
                    <span
                      key={activity}
                      className="theme-pill bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Academic Photographs */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <figure className="theme-surface overflow-hidden p-2">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-theme-sm">
                  <img
                    src={CONFERENCE_INFO.assets.buildingCampusPhoto}
                    alt="NSIT main academic building and landscaped campus grounds"
                    width={1536}
                    height={845}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-2 py-2 text-xs text-ink-muted">
                  NSIT academic complex and landscaped campus grounds (~9.2 acres)
                </figcaption>
              </figure>

              <figure className="theme-surface overflow-hidden p-2">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-theme-sm">
                  <img
                    src="/assets/campus/lecture-hall.jpg"
                    alt="Students attending a classroom lecture in a tiered lecture hall at NSIT"
                    width={1536}
                    height={1152}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="px-2 py-2 text-xs text-ink-muted">
                  Tiered lecture hall for technical sessions and academic interactions
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>

        {/* About NSIT & Academic Departments */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="theme-surface h-full p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2.5 text-accent">
                <Landmark className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                  About {ABOUT_INSTITUTE.name}
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
                Established in {ABOUT_INSTITUTE.establishedYear}, Netaji Subhas Institute of
                Technology is located at {ABOUT_INSTITUTE.location}.{' '}
                {ABOUT_INSTITUTE.approvals}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ABOUT_INSTITUTE.affiliations.map((aff) => (
                  <div key={aff.programme} className="theme-surface-muted p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
                      {aff.programme}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">{aff.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-border/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-muted">
                  Campus Infrastructure ({ABOUT_INSTITUTE.campusArea})
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ABOUT_INSTITUTE.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="theme-pill bg-surface-muted/80 px-3 py-1.5 text-xs font-medium text-ink"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="theme-surface flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-4 flex items-center gap-2.5 text-accent">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                    Organising Departments
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-ink-muted">
                  {ABOUT_INSTITUTE.departmentsSummary}
                </p>

                <StaggerGroup className="mt-4 space-y-2">
                  {ABOUT_INSTITUTE.departments.map((dept) => (
                    <StaggerItem key={dept}>
                      <div className="theme-surface-muted flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium text-ink">
                        <Building className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                        <span>{dept}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

