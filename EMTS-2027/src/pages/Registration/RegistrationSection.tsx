import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Info,
  Loader2,
  Mail,
} from 'lucide-react';
import { REGISTRATION_DETAILS, REGISTRATION_FEES } from '@/data/datesAndFees';
import { TECHNICAL_TRACKS } from '@/data/tracks';
import { CONTACT_INFO } from '@/data/conference';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { RegistrationTable } from '@/components/RegistrationTable/RegistrationTable';
import { PrimaryButton, SecondaryLinkButton } from '@/components/Buttons/ActionButtons';
import { Reveal } from '@/components/animations/MotionPrimitives';

interface RegistrationSectionProps {
  theme: ThemeId;
}

interface RegistrationReceipt {
  referenceId: string;
  fullName: string;
  email: string;
  categoryLabel: string;
  earlyFeeInr: string;
  regularFeeInr: string;
  trackCode: string;
  accommodationRequested: boolean;
  paymentStatus: string;
  createdAt: string;
}

type FieldErrors = Partial<
  Record<
    | 'fullName'
    | 'email'
    | 'phone'
    | 'affiliation'
    | 'categoryId'
    | 'trackCode'
    | 'paperTitle'
    | 'form',
    string
  >
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegistrationSection({ theme }: RegistrationSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [categoryId, setCategoryId] = useState(REGISTRATION_FEES[0].id);
  const [participationType, setParticipationType] = useState<'presenter' | 'attendee'>(
    'presenter'
  );
  const [trackCode, setTrackCode] = useState(TECHNICAL_TRACKS[0].code);
  const [paperTitle, setPaperTitle] = useState('');
  const [accommodationRequested, setAccommodationRequested] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null);

  const selectedTier =
    REGISTRATION_FEES.find((t) => t.id === categoryId) ?? REGISTRATION_FEES[0];

  const validateClient = (): FieldErrors => {
    const next: FieldErrors = {};
    if (fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name (at least 2 characters).';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      next.phone = 'Please enter a valid phone number (10–15 digits).';
    }
    if (affiliation.trim().length < 2) {
      next.affiliation = 'Please enter your institution, college, or organisation.';
    }
    if (participationType === 'presenter' && paperTitle.trim().length > 0 && paperTitle.trim().length < 5) {
      next.paperTitle = 'Paper title must be at least 5 characters if provided.';
    }
    return next;
  };

  const handleCategoryChange = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    if (nextCategoryId === 'attendee') {
      setParticipationType('attendee');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          affiliation: affiliation.trim(),
          categoryId,
          participationType,
          trackCode: participationType === 'attendee' ? 'NONE' : trackCode,
          paperTitle: participationType === 'attendee' ? '' : paperTitle.trim(),
          accommodationRequested,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setErrors({
          ...(data.errors || {}),
          form: data.message || 'Unable to submit registration. Please verify your details.',
        });
        return;
      }

      setReceipt(data.registration as RegistrationReceipt);
    } catch {
      setErrors({
        form: 'Unable to reach the ETIMS 2027 registration server. Ensure the backend API server is running and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setReceipt(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setAffiliation('');
    setPaperTitle('');
    setAccommodationRequested(false);
    setErrors({});
  };

  return (
    <section id="registration" className="border-b border-border/15 py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="06"
            eyebrow="Registration"
            title="Delegate Categories & Registration Fees"
            description="All fees are listed in Indian Rupees (INR) per the official conference brochure. At least one author of each accepted paper must register and present in person."
            theme={theme}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Fee Schedule */}
          <Reveal className="lg:col-span-8">
            <RegistrationTable tiers={REGISTRATION_FEES} />

            {/* Deadlines Strip */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="theme-surface flex items-center gap-3 p-4">
                <CalendarClock className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Early Registration Deadline
                  </p>
                  <p className="font-mono text-sm font-bold text-ink">
                    {REGISTRATION_DETAILS.earlyDeadline}
                  </p>
                </div>
              </div>
              <div className="theme-surface flex items-center gap-3 p-4">
                <CalendarClock className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Final Registration Deadline
                  </p>
                  <p className="font-mono text-sm font-bold text-ink">
                    {REGISTRATION_DETAILS.finalDeadline}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Inclusions & Official Payment Status */}
          <Reveal delay={0.08} className="lg:col-span-4">
            <div className="theme-surface flex h-full flex-col justify-between p-6">
              <div>
                <h3 className="font-serif text-xl font-semibold text-ink">
                  Registration Inclusions
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {REGISTRATION_DETAILS.inclusions.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-ink"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 rounded-theme-sm border border-border/20 bg-surface-muted/70 p-3.5 text-xs leading-relaxed text-ink-muted">
                  <p className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{REGISTRATION_DETAILS.publicationChargesNote}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-border/15 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  {REGISTRATION_DETAILS.portalStatus}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                  {REGISTRATION_DETAILS.portalNote}
                </p>
                <div className="mt-4">
                  <SecondaryLinkButton
                    href={`mailto:${CONTACT_INFO.email}?subject=ETIMS%202027%20Registration%20Enquiry`}
                    className="w-full"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span>Email Convenor for Fee Queries</span>
                  </SecondaryLinkButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Delegate Pre-Registration Form */}
        <Reveal delay={0.08}>
          <div id="registration-form" className="theme-surface mt-8 p-6 sm:p-8">
            <div className="flex flex-col gap-3 border-b border-border/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                  Delegate Registration
                </span>
                <h3 className="mt-1 font-serif text-xl font-bold text-ink sm:text-2xl">
                  Register for ETIMS 2027
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Submit your delegate details to record your registration and receive a reference ID. Official payment instructions will be shared once the payment portal is announced.
                </p>
              </div>

              <div className="theme-surface-muted shrink-0 px-4 py-3 text-left sm:text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Selected Category Fee
                </p>
                <p className="mt-0.5 font-mono text-sm font-bold text-accent">
                  Early {selectedTier.earlyInr} · Regular {selectedTier.regularInr}
                </p>
              </div>
            </div>

            {receipt ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 rounded-theme-sm border border-accent/35 bg-accent/[0.06] p-5 sm:p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-lg font-bold text-ink sm:text-xl">
                      Registration Recorded Successfully
                    </h4>
                    <p className="mt-1 text-sm text-ink-muted">
                      Your delegate registration record has been saved. Please retain your reference number for correspondence with the organising committee.
                    </p>

                    <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="theme-surface p-3">
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Reference ID
                        </dt>
                        <dd className="mt-0.5 font-mono text-sm font-bold text-accent">
                          {receipt.referenceId}
                        </dd>
                      </div>
                      <div className="theme-surface p-3">
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Delegate Name
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">
                          {receipt.fullName}
                        </dd>
                      </div>
                      <div className="theme-surface p-3">
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                          Category & Applicable Fee
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">
                          {receipt.categoryLabel} ({receipt.earlyFeeInr} / {receipt.regularFeeInr})
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-4 text-xs text-ink-muted">
                      <strong className="text-ink">Payment Status:</strong>{' '}
                      {receipt.paymentStatus}. Official fee payment instructions will be notified to{' '}
                      <span className="font-medium text-ink">{receipt.email}</span>.
                    </p>

                    <div className="mt-5">
                      <PrimaryButton onClick={handleReset}>
                        Register Another Delegate
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                {errors.form && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-theme-sm border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="reg-fullname"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink"
                    >
                      Full Name *
                    </label>
                    <input
                      id="reg-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      aria-invalid={Boolean(errors.fullName)}
                      placeholder="Dr. / Prof. / Mr. / Ms. Full Name"
                      className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    />
                    {errors.fullName && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink"
                    >
                      Email Address *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      placeholder="name@institution.edu"
                      className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink"
                    >
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      placeholder="+91 98765 43210"
                      className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    />
                    {errors.phone && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-affiliation"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink"
                    >
                      Institution / Organisation *
                    </label>
                    <input
                      id="reg-affiliation"
                      type="text"
                      required
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      aria-invalid={Boolean(errors.affiliation)}
                      placeholder="University, Institute, PSU, or Company"
                      className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    />
                    {errors.affiliation && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.affiliation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-category"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink"
                    >
                      Registration Category *
                    </label>
                    <select
                      id="reg-category"
                      value={categoryId}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    >
                      {REGISTRATION_FEES.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.category} ({tier.earlyInr} Early / {tier.regularInr} Regular)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-participation"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink"
                    >
                      Participation Role *
                    </label>
                    <select
                      id="reg-participation"
                      value={participationType}
                      onChange={(e) =>
                        setParticipationType(e.target.value as 'presenter' | 'attendee')
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                    >
                      <option value="presenter">
                        Author / Presenter (Oral or Poster)
                      </option>
                      <option value="attendee">
                        Non-presenting Co-author / Attendee
                      </option>
                    </select>
                  </div>

                  {participationType === 'presenter' && (
                    <>
                      <div>
                        <label
                          htmlFor="reg-track"
                          className="block text-xs font-semibold uppercase tracking-wider text-ink"
                        >
                          Preferred Technical Track *
                        </label>
                        <select
                          id="reg-track"
                          value={trackCode}
                          onChange={(e) => setTrackCode(e.target.value)}
                          className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                        >
                          {TECHNICAL_TRACKS.map((track) => (
                            <option key={track.code} value={track.code}>
                              {track.code} — {track.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="reg-paper"
                          className="block text-xs font-semibold uppercase tracking-wider text-ink"
                        >
                          Tentative Paper Title (Optional)
                        </label>
                        <input
                          id="reg-paper"
                          type="text"
                          value={paperTitle}
                          onChange={(e) => setPaperTitle(e.target.value)}
                          aria-invalid={Boolean(errors.paperTitle)}
                          placeholder="Title of your manuscript (if ready)"
                          className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                        />
                        {errors.paperTitle && (
                          <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                            {errors.paperTitle}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <label className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-theme-sm border border-border/20 bg-surface-muted/60 p-3.5 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={accommodationRequested}
                    onChange={(e) => setAccommodationRequested(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-accent"
                  />
                  <span>
                    Request campus accommodation enquiry at NSIT, Bihta{' '}
                    <span className="text-xs text-ink-muted">
                      (Limited accommodation may be available upon prior request, subject to availability)
                    </span>
                  </span>
                </label>

                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-ink-muted">
                    No online payment is collected on this form. Official fee payment details will be communicated separately.
                  </p>
                  <PrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full shrink-0 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Submitting Registration...</span>
                      </>
                    ) : (
                      <span>Submit Registration</span>
                    )}
                  </PrimaryButton>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
