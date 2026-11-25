import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  BedDouble,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
  UserCheck,
} from 'lucide-react';
import { CONTACT_INFO, VENUE_DETAILS } from '@/data/conference';
import { GALLERY_PHOTOS } from '@/data/gallery';
import type { ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { Gallery } from '@/components/Gallery/Gallery';
import { PrimaryButton, SecondaryLinkButton } from '@/components/Buttons/ActionButtons';
import { Reveal } from '@/components/animations/MotionPrimitives';

interface VenueGalleryContactProps {
  theme: ThemeId;
}

export function VenueGallerySection({ theme }: VenueGalleryContactProps) {
  return (
    <>
      {/* Venue & Access */}
      <section id="venue" className="border-b border-border/15 py-14 sm:py-20">
        <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              index="08"
              eyebrow="Venue & Location"
              title="Conference Campus & Travel Access"
              description={VENUE_DETAILS.accessNote}
              theme={theme}
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <div className="theme-surface h-full p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-2.5 text-accent">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold text-ink">
                    {VENUE_DETAILS.campusName}
                  </h3>
                </div>

                <p className="text-sm font-medium text-ink">
                  {VENUE_DETAILS.addressLines.join(', ')}
                </p>

                <div className="mt-5 space-y-3">
                  <div className="theme-surface-muted flex items-start gap-3 p-4">
                    <Navigation
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-ink">Regional Connectivity</p>
                      <p className="mt-1 leading-relaxed text-ink-muted">
                        Located approximately 30 km west of Patna.{' '}
                        {VENUE_DETAILS.travelNote}
                      </p>
                    </div>
                  </div>

                  <div className="theme-surface-muted flex items-start gap-3 p-4">
                    <BedDouble
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-ink">Accommodation</p>
                      <p className="mt-1 leading-relaxed text-ink-muted">
                        {VENUE_DETAILS.accommodationNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <SecondaryLinkButton
                    href={VENUE_DETAILS.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Open Directions in Maps</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </SecondaryLinkButton>
                </div>
              </div>
            </Reveal>

            {/* Campus Photograph & Directions Integration Card */}
            <Reveal delay={0.08} className="lg:col-span-6">
              <div className="theme-surface flex h-full flex-col justify-between overflow-hidden p-3">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-theme-sm">
                  <img
                    src="/assets/campus/campus-overview.jpg"
                    alt="NSIT Campus Overview at Amhara, Bihta, Bihar"
                    width={1536}
                    height={864}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3 flex flex-col gap-2 rounded-theme-sm border border-dashed border-border/35 bg-surface-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                      Campus Map & Travel Guide
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Interactive campus map & detailed arrival guide to be updated closer to the conference.
                    </p>
                  </div>
                  <span className="theme-pill shrink-0 bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-ink">
                    Physical Mode
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="border-b border-border/15 py-14 sm:py-20">
        <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              index="09"
              eyebrow="Campus & Facilities Gallery"
              title="Life & Infrastructure at NSIT, Bihta"
              description="Explore supplied campus photographs including academic buildings, tiered lecture halls, computing laboratories, and hands-on engineering sessions. Select any image to view in full screen."
              theme={theme}
            />
          </Reveal>

          <Gallery photos={GALLERY_PHOTOS} />
        </div>
      </section>
    </>
  );
}

export function ContactSection({ theme }: VenueGalleryContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [subject, setSubject] = useState('Paper Submission / General Enquiry');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const buildMailtoHref = () => {
    const bodyLines = [
      `Name: ${name.trim()}`,
      email.trim() ? `Reply Email: ${email.trim()}` : '',
      affiliation.trim() ? `Affiliation: ${affiliation.trim()}` : '',
      '',
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
      `[ETIMS 2027] ${subject}`
    )}&body=${encodeURIComponent(bodyLines)}`;
  };

  const handleSubmitEnquiry = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address so we can reply.';
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Please enter an enquiry message (at least 10 characters).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          affiliation: affiliation.trim(),
          subject,
          message: message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setErrors({
          ...(data.errors || {}),
          form: data.message || 'Unable to send enquiry. Please check the fields below.',
        });
        return;
      }
      setSubmittedRef(data.inquiry?.referenceId ?? 'Recorded');
      setMessage('');
    } catch {
      setErrors({
        form: 'Unable to reach the ETIMS 2027 enquiry server. You can also send your message directly using the email button below.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="10"
            eyebrow="Contact & Enquiries"
            title="Connect with the Conference Convenor"
            description="For queries related to paper submissions, registration, accommodation requests, or sponsorship, please contact the Conference Convenor."
            theme={theme}
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Official Contact Cards */}
          <Reveal className="lg:col-span-5">
            <div className="space-y-4">
              <div className="theme-surface p-6">
                <div className="flex items-center gap-4">
                  <img
                    src="/assets/committee/atif-hussain.png"
                    alt="Dr. Atif Hussain — Conference Convenor"
                    width={72}
                    height={72}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-full border border-border/25 object-cover"
                  />
                  <div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent">
                      <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      {CONTACT_INFO.role}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-ink">
                      {CONTACT_INFO.convenorName}
                    </h3>
                    <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">
                      {CONTACT_INFO.designation}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="theme-surface theme-card-interactive flex items-center gap-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-theme-sm bg-accent/10 text-accent">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Official Email
                  </p>
                  <p className="truncate text-base font-bold text-ink">
                    {CONTACT_INFO.email}
                  </p>
                </div>
              </a>

              <a
                href={CONTACT_INFO.phoneHref}
                className="theme-surface theme-card-interactive flex items-center gap-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-theme-sm bg-accent/10 text-accent">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Telephone
                  </p>
                  <p className="font-mono text-base font-bold text-ink">
                    {CONTACT_INFO.phoneDisplay}
                  </p>
                </div>
              </a>

              <div className="theme-surface-muted p-4 text-xs leading-relaxed text-ink-muted">
                {CONTACT_INFO.websiteNote}
              </div>
            </div>
          </Reveal>

          {/* Direct Enquiry Form */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <form
              onSubmit={handleSubmitEnquiry}
              className="theme-surface h-full p-6 sm:p-8"
              noValidate
            >
              <h3 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                Send an Enquiry to the Convenor
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Submit your question directly below, or email{' '}
                <span className="font-semibold text-ink">{CONTACT_INFO.email}</span>.
              </p>

              {errors.form && (
                <div
                  role="alert"
                  className="mt-4 flex items-start gap-2.5 rounded-theme-sm border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{errors.form}</span>
                </div>
              )}

              {submittedRef && (
                <div
                  role="status"
                  className="mt-4 flex items-start gap-2.5 rounded-theme-sm border border-accent/35 bg-accent/[0.08] p-4 text-sm text-ink"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">
                      Enquiry Recorded (Ref: <span className="font-mono text-accent">{submittedRef}</span>)
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Thank you, {name}. Your enquiry has been logged for the Conference Convenor.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="Dr. / Prof. / Mr. / Ms."
                    className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                  />
                  {errors.name && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    Your Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="you@institution.edu"
                    className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                  />
                  {errors.email && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-affiliation"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    Institution / Organisation
                  </label>
                  <input
                    id="contact-affiliation"
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="University, Institute, or Company"
                    className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    Enquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                  >
                    <option value="Paper Submission / General Enquiry">
                      Paper Submission / General Enquiry
                    </option>
                    <option value="Registration & Fee Details">
                      Registration & Fee Details
                    </option>
                    <option value="Accommodation Request (Bihta Campus)">
                      Accommodation Request (Bihta Campus)
                    </option>
                    <option value="Sponsorship & Exhibition Enquiry">
                      Sponsorship & Exhibition Enquiry
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-ink"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  placeholder="Write your question or request..."
                  className="mt-1.5 w-full rounded-theme-sm border border-border/35 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                />
                {errors.message && (
                  <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <PrimaryButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </PrimaryButton>

                <SecondaryLinkButton
                  href={buildMailtoHref()}
                  className="w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Open in Email App</span>
                </SecondaryLinkButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

