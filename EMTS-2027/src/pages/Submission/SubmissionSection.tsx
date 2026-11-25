import { AlertTriangle, BookCheck, FileText, Info, Send } from 'lucide-react';
import { IMPORTANT_DATES, SUBMISSION_DETAILS } from '@/data/datesAndFees';
import { CONFERENCE_INFO } from '@/data/conference';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { Reveal } from '@/components/animations/MotionPrimitives';

interface SubmissionSectionProps {
  theme: ThemeId;
}

export function SubmissionSection({ theme }: SubmissionSectionProps) {
  const keySubmissionDates = IMPORTANT_DATES.filter((item) =>
    ['full-paper', 'acceptance', 'camera-ready'].includes(item.id)
  );

  return (
    <section id="submission" className="border-b border-border/15 py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="05"
            eyebrow="Paper Submission & Review"
            title="Submission Guidelines & Peer Review"
            description={SUBMISSION_DETAILS.invitation}
            theme={theme}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Paper Submission Instructions */}
          <Reveal className="lg:col-span-7">
            <div className="theme-surface h-full p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2.5 text-accent">
                <FileText className="h-5 w-5" aria-hidden="true" />
                <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                  How to Submit
                </h3>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                <p>{SUBMISSION_DETAILS.portalNote}</p>
                <ul className="space-y-2.5">
                  <li className="theme-surface-muted flex items-start gap-3 p-3.5 text-ink">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">Abstract Length:</strong>{' '}
                      {SUBMISSION_DETAILS.abstractRequirement}
                    </span>
                  </li>
                  <li className="theme-surface-muted flex items-start gap-3 p-3.5 text-ink">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">Originality:</strong>{' '}
                      Submissions must be original, unpublished full-length manuscripts
                      not under consideration elsewhere.
                    </span>
                  </li>
                  <li className="theme-surface-muted flex items-start gap-3 p-3.5 text-ink">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">Presentation Requirement:</strong>{' '}
                      {SUBMISSION_DETAILS.presentationRequirement}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Submission Key Deadlines */}
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-border/15 pt-5 sm:grid-cols-3">
                {keySubmissionDates.map((d) => (
                  <div key={d.id} className="theme-surface-muted p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      {d.activity}
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-accent">
                      {d.date}
                    </p>
                  </div>
                ))}
              </div>

              {/* Submission Portal Placeholder */}
              <div className="mt-6 rounded-theme-sm border border-dashed border-accent/40 bg-accent/[0.05] p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      Official Submission Portal
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {SUBMISSION_DETAILS.portalLabel}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      The official submission link and publisher manuscript template will be
                      activated here once formally announced.
                    </p>
                  </div>
                  <a
                    href={CONFERENCE_INFO.brochurePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="theme-btn-secondary inline-flex min-h-[40px] shrink-0 items-center justify-center px-4 py-2 text-xs font-semibold"
                  >
                    Read CFP in Brochure
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Review & Publication */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="theme-surface flex h-full flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-4 flex items-center gap-2.5 text-accent">
                  <BookCheck className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                    Review & Publication
                  </h3>
                </div>

                <ul className="space-y-3">
                  {SUBMISSION_DETAILS.reviewProcess.map((step, idx) => (
                    <li
                      key={step}
                      className="theme-surface-muted flex items-start gap-3 p-3.5 text-sm leading-relaxed text-ink"
                    >
                      <span className="font-mono text-xs font-bold text-accent">
                        0{idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                role="note"
                className="mt-6 rounded-theme-sm border border-accent-secondary/40 bg-accent-secondary/10 p-4"
              >
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent-secondary"
                    aria-hidden="true"
                  />
                  <div className="text-xs leading-relaxed text-ink sm:text-sm">
                    <p className="font-bold">Publication & Indexing Notice</p>
                    <p className="mt-1 text-ink-muted">
                      {SUBMISSION_DETAILS.publicationDisclaimer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
                <Info className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  Enquiries regarding manuscripts:{' '}
                  <a
                    href="mailto:etims2027@nsiterp.in"
                    className="font-semibold text-accent hover:underline"
                  >
                    etims2027@nsiterp.in
                  </a>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

