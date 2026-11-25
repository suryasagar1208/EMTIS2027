import { useEffect, useState } from 'react';
import { TECHNICAL_TRACKS } from '@/data/tracks';
import type { TechnicalTrack, ThemeId } from '@/types/conference';
import { SectionHeading } from '@/components/SectionHeading/SectionHeading';
import { TrackCard } from '@/components/Cards/TrackCard';
import { TrackDetailModal } from '@/components/Cards/TrackDetailModal';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/animations/MotionPrimitives';

interface TracksSectionProps {
  theme: ThemeId;
}

export function TracksSection({ theme }: TracksSectionProps) {
  const [selectedTrack, setSelectedTrack] = useState<TechnicalTrack | null>(null);

  useEffect(() => {
    const handleOpenTrack = (event: Event) => {
      const code = (event as CustomEvent<string>).detail;
      const match = TECHNICAL_TRACKS.find((t) => t.code === code);
      if (match) setSelectedTrack(match);
    };
    window.addEventListener('etims:open-track', handleOpenTrack);
    return () => window.removeEventListener('etims:open-track', handleOpenTrack);
  }, []);

  return (
    <section id="tracks" className="border-b border-border/15 py-14 sm:py-20">
      <div className="mx-auto max-w-conference px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Call for Papers — Technical Tracks"
            title="Eight Multidisciplinary Research Tracks"
            description="ETIMS 2027 invites original, unpublished research papers across eight dedicated tracks. Related multidisciplinary contributions are also welcome."
            theme={theme}
          />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TECHNICAL_TRACKS.map((track) => (
            <StaggerItem key={track.code} className="h-full">
              <TrackCard track={track} onExplore={setSelectedTrack} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      <TrackDetailModal
        track={selectedTrack}
        onClose={() => setSelectedTrack(null)}
      />
    </section>
  );
}

