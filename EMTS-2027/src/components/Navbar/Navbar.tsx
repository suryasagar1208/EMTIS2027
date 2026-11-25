import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CONFERENCE_INFO, NAV_ITEMS } from '@/data/conference';
import type { ThemeId } from '@/types/conference';
import { PrimaryLinkButton, ThemeSwitcher } from '@/components/Buttons/ActionButtons';

interface NavbarProps {
  activeSection: string;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export function Navbar({ activeSection, theme, onSelectTheme }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const scrollToHash = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
    focusFieldId?: string
  ) => {
    if (!href.startsWith('#')) {
      document.body.style.overflow = '';
      setMobileOpen(false);
      return;
    }

    e.preventDefault();
    document.body.style.overflow = '';
    setMobileOpen(false);

    const targetId = href.slice(1);
    window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start',
        });
        window.history.replaceState(null, '', href);
      }
      if (focusFieldId) {
        window.setTimeout(() => {
          document.getElementById(focusFieldId)?.focus({ preventScroll: true });
        }, 420);
      }
    });
  };

  return (
    <header className="theme-header-bar sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-16 max-w-conference items-center justify-between gap-1.5 px-2.5 min-[360px]:gap-2 min-[360px]:px-3 sm:h-[72px] sm:px-6 lg:gap-3 lg:px-6 xl:px-8">
        {/* Brand: Preserved NSIT Logo + ETIMS 2027 */}
        <a
          href="#home"
          className="flex min-w-0 shrink-0 items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-[360px]:gap-2 sm:gap-2.5"
        >
          <img
            src={CONFERENCE_INFO.assets.nsitLogo}
            alt="Netaji Subhas Institute of Technology (NSIT) Official Logo"
            width={44}
            height={44}
            className="h-8 w-8 shrink-0 rounded-theme-sm border border-border/20 bg-white object-contain p-0.5 min-[360px]:h-9 min-[360px]:w-9 sm:h-11 sm:w-11"
          />
          <div className="min-w-0 leading-tight">
            <span className="block whitespace-nowrap font-serif text-[13px] font-bold tracking-tight text-ink min-[360px]:text-sm sm:text-base xl:text-lg">
              {CONFERENCE_INFO.acronym}
            </span>
            <span className="hidden truncate text-[11px] font-medium text-ink-muted sm:block">
              NSIT · Bihta, Bihar
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          aria-label="Primary conference navigation"
          className="hidden items-center gap-0.5 lg:flex xl:gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const compactLabel =
              item.id === 'tracks'
                ? 'Tracks'
                : item.id === 'dates'
                  ? 'Dates'
                  : item.label;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-theme-sm px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent xl:px-2.5 xl:text-[13px] ${
                  isActive
                    ? 'bg-accent/10 font-semibold text-accent'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {compactLabel !== item.label ? (
                  <>
                    <span className="xl:hidden">{compactLabel}</span>
                    <span className="hidden xl:inline">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-2.5">
          <ThemeSwitcher theme={theme} onSelectTheme={onSelectTheme} compact />
          <PrimaryLinkButton
            href="#registration-form"
            onClick={(e) => scrollToHash(e, '#registration-form', 'reg-fullname')}
            className="px-3.5 py-2 text-xs xl:px-4 xl:text-sm"
          >
            <span className="xl:hidden">Register</span>
            <span className="hidden xl:inline">Register Now</span>
          </PrimaryLinkButton>
        </div>

        {/* Mobile / Tablet Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher theme={theme} onSelectTheme={onSelectTheme} compact />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-conference-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="theme-btn-secondary inline-flex h-11 w-11 items-center justify-center p-0"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/35 backdrop-blur-sm sm:top-[72px] lg:hidden"
              aria-hidden="true"
            />
            <motion.nav
              id="mobile-conference-nav"
              aria-label="Mobile conference navigation"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: prefersReduced ? 0 : 0.22 }}
              className="theme-surface fixed inset-x-3 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto p-4 sm:inset-x-6 sm:top-[84px] lg:hidden"
            >
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        onClick={(e) => scrollToHash(e, item.href)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex min-h-[44px] items-center justify-between rounded-theme-sm px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-accent/12 font-semibold text-accent'
                            : 'text-ink hover:bg-surface-muted/70'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-border/20 pt-4">
                <PrimaryLinkButton
                  href="#registration-form"
                  onClick={(e) => scrollToHash(e, '#registration-form', 'reg-fullname')}
                  className="w-full"
                >
                  Register Now
                </PrimaryLinkButton>
                <a
                  href={CONFERENCE_INFO.brochurePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    document.body.style.overflow = '';
                    setMobileOpen(false);
                  }}
                  className="theme-btn-secondary inline-flex min-h-[44px] w-full items-center justify-center px-4 py-2 text-sm font-medium"
                >
                  Download Official Brochure (PDF)
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
