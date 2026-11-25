import { useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import { NAV_ITEMS } from '@/data/conference';
import { useTheme } from '@/hooks/useTheme';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { ConferenceLayout } from '@/layouts/ConferenceLayout';
import { HomePage } from '@/pages/Home/HomePage';

export function App() {
  const { theme, setTheme } = useTheme();
  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);
  const activeSection = useScrollSpy(sectionIds, 140);

  return (
    <MotionConfig reducedMotion="user">
      <ConferenceLayout
        activeSection={activeSection}
        theme={theme}
        onSelectTheme={setTheme}
      >
        <HomePage theme={theme} />
      </ConferenceLayout>
    </MotionConfig>
  );
}

export default App;

