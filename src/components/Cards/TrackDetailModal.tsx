import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { TechnicalTrack } from '@/types/conference';
import { PrimaryLinkButton } from '@/components/Buttons/ActionButtons';

interface TrackDetailModalProps {
  track: TechnicalTrack | null;
  onClose: () => void;
}

export function TrackDetailModal({ track, onClose }: TrackDetailModalProps) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!track) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [track, onClose]);

  return (
    <AnimatePresence>
      {track && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="track-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: prefersReduced ? 0 : 0.22 }}
            className="theme-surface relative z-10 max-h-[85dvh] w-full max-w-2xl overflow-y-auto bg-surface p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/20 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">
                  Technical Track {track.code}
                </span>
                <h3
                  id="track-modal-title"
                  className="mt-1 font-serif text-xl font-bold text-ink sm:text-2xl"
                >
                  {track.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close track details"
                className="theme-btn-secondary inline-flex h-10 w-10 shrink-0 items-center justify-center p-0"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
              {track.summary}
            </p>

            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
                Official Call for Papers Topics
              </h4>
              <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {track.topics.map((topic) => (
                  <li
                    key={topic}
                    className="theme-surface-muted flex items-start gap-2.5 p-3 text-sm text-ink"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-border/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-muted">
                Related multidisciplinary contributions are also welcome.
              </p>
              <PrimaryLinkButton href="#submission" onClick={onClose}>
                Paper Submission Guidelines
              </PrimaryLinkButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

