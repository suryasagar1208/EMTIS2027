import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: string[], offset = 120): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? 'home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;
      let current = sectionIds[0] ?? 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}

