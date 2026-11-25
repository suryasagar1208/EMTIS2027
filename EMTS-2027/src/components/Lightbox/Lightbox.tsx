import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { GalleryPhoto } from '@/types/conference';

interface LightboxProps {
  photos: GalleryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({
  photos,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const prefersReduced = useReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const current = activeIndex !== null ? photos[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {current && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 p-3 text-white sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Image preview: ${current.title}`}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
            const delta = endX - touchStartX.current;
            if (Math.abs(delta) > 45) {
              if (delta > 0) onPrev();
              else onNext();
            }
            touchStartX.current = null;
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="font-mono text-xs text-white/70">
                {activeIndex + 1} / {photos.length} · {current.category}
              </span>
              <h3 className="truncate font-serif text-base font-semibold sm:text-lg">
                {current.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close lightbox"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-theme-sm border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Center Image */}
          <div className="relative my-auto flex flex-1 items-center justify-center overflow-hidden py-3">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous photograph"
              className="absolute left-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-3"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>

            <motion.div
              key={current.id}
              initial={prefersReduced ? false : { opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex max-h-[72dvh] max-w-5xl items-center justify-center px-12 sm:px-16"
            >
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[70dvh] w-auto max-w-full rounded-theme-sm object-contain shadow-2xl"
              />
            </motion.div>

            <button
              type="button"
              onClick={onNext}
              aria-label="Next photograph"
              className="absolute right-1 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-3"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Caption */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs leading-relaxed text-white/85 sm:text-sm">
              {current.caption}
            </p>
            <p className="mt-1 text-[11px] text-white/55 sm:hidden">
              Swipe left or right to navigate
            </p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

