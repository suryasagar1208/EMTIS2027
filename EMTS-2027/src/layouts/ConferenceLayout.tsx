import { useEffect, useState, type ReactNode } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import type { ThemeId } from '@/types/conference';
import { Navbar } from '@/components/Navbar/Navbar';
import { Footer } from '@/components/Footer/Footer';
import { GaneshaAssistantModal } from '@/components/Ganesha/GaneshaAssistantModal';

interface ConferenceLayoutProps {
  children: ReactNode;
  activeSection: string;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export function ConferenceLayout({
  children,
  activeSection,
  theme,
  onSelectTheme,
}: ConferenceLayoutProps) {
  const [ganeshaOpen, setGaneshaOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.hash === '#ganesha' ||
      window.location.search.includes('assistant=ganesha')
    );
  });

  useEffect(() => {
    const onHashOrEvent = () => {
      if (window.location.hash === '#ganesha') {
        setGaneshaOpen(true);
      }
    };
    const onCustomOpen = () => setGaneshaOpen(true);
    window.addEventListener('hashchange', onHashOrEvent);
    window.addEventListener('etims:open-ganesha', onCustomOpen);
    return () => {
      window.removeEventListener('hashchange', onHashOrEvent);
      window.removeEventListener('etims:open-ganesha', onCustomOpen);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-theme-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to conference content
      </a>

      <Navbar
        activeSection={activeSection}
        theme={theme}
        onSelectTheme={onSelectTheme}
      />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Floating GANESHA AI Voice Assistant Launcher */}
      <button
        type="button"
        onClick={() => setGaneshaOpen(true)}
        aria-label="Open GANESHA — ETIMS 2027 AI Voice Assistant"
        className="theme-btn-primary fixed bottom-4 right-4 z-40 inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-xl transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
      >
        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
          <Mic className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <span>Ask Ganesha</span>
        <Sparkles className="h-3.5 w-3.5 opacity-90" aria-hidden="true" />
      </button>

      <GaneshaAssistantModal
        isOpen={ganeshaOpen}
        onClose={() => {
          setGaneshaOpen(false);
          if (window.location.hash === '#ganesha') {
            window.history.replaceState(null, '', '#home');
          }
        }}
      />
    </div>
  );
}
