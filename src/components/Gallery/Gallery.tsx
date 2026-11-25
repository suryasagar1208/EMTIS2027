import { useState } from 'react';
import { Expand } from 'lucide-react';
import type { GalleryPhoto } from '@/types/conference';
import { Lightbox } from '@/components/Lightbox/Lightbox';
import { StaggerGroup, StaggerItem } from '@/components/animations/MotionPrimitives';

interface GalleryProps {
  photos: GalleryPhoto[];
}

export function Gallery({ photos }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === null ? null : (prev + 1) % photos.length
    );
  };

  return (
    <>
      <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <StaggerItem
            key={photo.id}
            className={index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${photo.title} in full view`}
              className="theme-surface theme-card-interactive group flex h-full w-full flex-col overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div
                className={`relative w-full overflow-hidden bg-surface-muted ${
                  index === 0 ? 'aspect-[16/9]' : 'aspect-[16/10]'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="theme-pill absolute left-3 top-3 bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {photo.category}
                </span>
                <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-theme-sm bg-black/60 text-white opacity-90 transition-opacity group-hover:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <h3 className="font-serif text-base font-semibold text-ink sm:text-lg">
                    {photo.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Lightbox
        photos={photos}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  );
}

