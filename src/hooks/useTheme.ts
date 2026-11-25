import { useEffect, useState } from 'react';
import type { ThemeId } from '@/types/conference';

const STORAGE_KEY = 'etims-2027-theme';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'glass';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'swiss' || saved === 'glass' ? saved : 'glass';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'glass' ? 'swiss' : 'glass'));
  };

  return { theme, setTheme, toggleTheme };
}

