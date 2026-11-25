import { Mail, MapPin, Phone } from 'lucide-react';
import { CONFERENCE_INFO, CONTACT_INFO, NAV_ITEMS } from '@/data/conference';
import { TECHNICAL_TRACKS } from '@/data/tracks';

export function Footer() {
  return (
    <footer className="border-t border-border/20 bg-surface/65 backdrop-blur-md">
      <div className="mx-auto max-w-conference px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Conference Identity */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <img
                src={CONFERENCE_INFO.assets.nsitLogo}
                alt="Netaji Subhas Institute of Technology Logo"
                width={52}
                height={52}
                loading="lazy"
                className="h-12 w-12 shrink-0 rounded-theme-sm border border-border/20 bg-white object-contain p-0.5"
              />
              <div>
                <h2 className="font-serif text-lg font-bold text-ink">
                  {CONFERENCE_INFO.acronym}
                </h2>
                <p className="text-xs font-medium text-ink-muted">
                  {CONFERENCE_INFO.edition}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              1st National Conference on {CONFERENCE_INFO.fullTitle}, organised by{' '}
              Netaji Subhas Institute of Technology (NSIT), Amhara, Bihta, Patna,
              Bihar.
            </p>

            <div className="mt-4 space-y-1.5 text-xs text-ink-muted">
              <p className="font-semibold text-ink">
                Dates: {CONFERENCE_INFO.datesDisplay} (tentative)
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span>{CONFERENCE_INFO.venueFull}</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="inline-block py-0.5 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Tracks Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Technical Tracks
            </h3>
            <ul className="mt-3 space-y-2">
              {TECHNICAL_TRACKS.map((track) => (
                <li key={track.code}>
                  <a
                    href="#tracks"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent('etims:open-track', { detail: track.code })
                      );
                    }}
                    className="inline-block py-0.5 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    <span className="font-mono text-xs font-semibold text-accent">
                      {track.code}
                    </span>{' '}
                    · {track.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Official Contact
            </h3>
            <div className="mt-3 space-y-2.5 text-sm text-ink-muted">
              <div>
                <p className="font-semibold text-ink">{CONTACT_INFO.convenorName}</p>
                <p className="text-xs">{CONTACT_INFO.role}</p>
                <p className="text-xs">{CONTACT_INFO.designation}</p>
              </div>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{CONTACT_INFO.email}</span>
              </a>
              <a
                href={CONTACT_INFO.phoneHref}
                className="flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-accent"
              >
                <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{CONTACT_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/15 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2027 ETIMS 2027 · Netaji Subhas Institute of Technology, Bihta, Patna, Bihar.
          </p>
          <p>
            All dates, publisher details, and registration schedules are provisional per the official brochure.
          </p>
        </div>
      </div>
    </footer>
  );
}

