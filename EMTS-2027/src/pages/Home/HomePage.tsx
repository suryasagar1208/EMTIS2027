import type { ThemeId } from '@/types/conference';
import { Hero } from '@/components/Hero/Hero';
import { AboutSection } from '@/pages/About/AboutSection';
import { TracksSection } from '@/pages/Tracks/TracksSection';
import { CommitteesSection } from '@/pages/Committees/CommitteesSection';
import { ImportantDatesSection } from '@/pages/ImportantDates/ImportantDatesSection';
import { SubmissionSection } from '@/pages/Submission/SubmissionSection';
import { RegistrationSection } from '@/pages/Registration/RegistrationSection';
import { ParticipationSection } from '@/pages/About/ParticipationSection';
import {
  ContactSection,
  VenueGallerySection,
} from '@/pages/Contact/VenueGalleryContactSection';

interface HomePageProps {
  theme: ThemeId;
}

export function HomePage({ theme }: HomePageProps) {
  return (
    <>
      <Hero theme={theme} />
      <AboutSection theme={theme} />
      <TracksSection theme={theme} />
      <CommitteesSection theme={theme} />
      <ImportantDatesSection theme={theme} />
      <SubmissionSection theme={theme} />
      <RegistrationSection theme={theme} />
      <ParticipationSection theme={theme} />
      <VenueGallerySection theme={theme} />
      <ContactSection theme={theme} />
    </>
  );
}

