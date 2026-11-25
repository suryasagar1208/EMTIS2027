import {
  ArrowRight,
  CalendarDays,
  Compass,
  Download,
  Layers,
  MapPin,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { CONFERENCE_INFO, HERO_HIGHLIGHTS } from '@/data/conference';
import type { ThemeId } from '@/types/conference';
import { PrimaryLinkButton, SecondaryLinkButton } from '@/components/Buttons/ActionButtons';
import { Countdown } from '@/components/Countdown/Countdown';

const HIGHLIGHT_ICONS = {
  calendar: CalendarDays,
  layers: Layers,
  users: Users,
  mapPin: MapPin,
  sparkles: Sparkles,
};

interface HeroProps {
  theme: ThemeId;
}

export function Hero({ theme }: HeroProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-border/15 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-14"
    >
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Conference Identity & Primary Actions */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="theme-pill inline-flex items-center gap-2 bg-surface/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                {CONFERENCE_INFO.edition}
              </span>
              <span className="theme-pill inline-flex items-center gap-1.5 bg-surface-muted/75 px-3 py-1 text-xs font-medium text-ink-muted">
                Organised by NSIT, Bihar
              </span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-4">
              <img
                src={CONFERENCE_INFO.assets.etimsBadge}
                alt="ETIMS 2027 Official Conference Emblem"
                width={80}
                height={80}
                className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
              />
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-sm">
                  {CONFERENCE_INFO.acronym}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted sm:text-sm">
                  {CONFERENCE_INFO.disciplinesTagline}
                </p>
              </div>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.85rem]">
              {CONFERENCE_INFO.fullTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              A national multidisciplinary forum bringing together researchers,
              academicians, scientists, industry professionals, and students at Netaji
              Subhas Institute of Technology, Amhara, Bihta, Patna, Bihar.
            </p>

            {/* Key Date & Venue Badges */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="theme-surface flex items-start gap-3 p-3.5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-theme-sm bg-accent/10 text-accent">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Conference Dates
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-ink">
                    {CONFERENCE_INFO.datesDisplay}{' '}
                    <span className="font-normal text-ink-muted">(tentative)</span>
                  </p>
                </div>
              </div>

              <div className="theme-surface flex items-start gap-3 p-3.5">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-theme-sm bg-accent/10 text-accent">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Conference Venue
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-ink">
                    {CONFERENCE_INFO.venueShort}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryLinkButton
                href="#registration-form"
                onClick={() => {
                  window.setTimeout(() => {
                    document.getElementById('reg-fullname')?.focus({ preventScroll: true });
                  }, 450);
                }}
                className="w-full sm:w-auto"
              >
                <span>Register Now</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </PrimaryLinkButton>
              <SecondaryLinkButton href="#submission" className="w-full sm:w-auto">
                <span>Call for Papers</span>
              </SecondaryLinkButton>
              <SecondaryLinkButton href="#about" className="w-full sm:w-auto">
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore Conference</span>
              </SecondaryLinkButton>
            </div>

            <div className="mt-4">
              <a
                href={CONFERENCE_INFO.brochurePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center gap-2 text-xs font-semibold text-accent underline-offset-4 hover:underline sm:text-sm"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>View / Download Official Conference Brochure (PDF)</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Supplied Campus Photograph + Countdown */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.54, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 lg:col-span-5"
          >
            <div
              className={`theme-surface overflow-hidden p-2 ${
                theme === 'swiss' ? 'p-1.5' : ''
              }`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-theme-sm">
                <img
                  src={CONFERENCE_INFO.assets.heroCampusPhoto}
                  alt="Panoramic view of Netaji Subhas Institute of Technology campus, Amhara, Bihta"
                  width={1536}
                  height={864}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-3 pt-8 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/85">
                    Host Institution
                  </p>
                  <p className="text-sm font-semibold">
                    NSIT Campus, Amhara, Bihta, Patna
                  </p>
                </div>
              </div>
            </div>

            <Countdown />
          </motion.div>
        </div>

        {/* Conference Highlights Strip */}
        <div className="mt-10 sm:mt-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {HERO_HIGHLIGHTS.map((item) => {
              const Icon = HIGHLIGHT_ICONS[item.iconName];
              return (
                <div
                  key={item.id}
                  className="theme-surface flex items-start gap-3 p-4"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-theme-sm bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-ink">
                      {item.value}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 text-xs leading-snug text-ink-muted">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

