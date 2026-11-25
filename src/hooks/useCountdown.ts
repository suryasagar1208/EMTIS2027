import { useEffect, useState } from 'react';

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateRemaining(targetMs: number): CountdownValues {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isPast: false };
}

export function useCountdown(targetIso: string): CountdownValues {
  const targetMs = new Date(targetIso).getTime();
  const [remaining, setRemaining] = useState<CountdownValues>(() =>
    calculateRemaining(targetMs)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(calculateRemaining(targetMs));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [targetMs]);

  return remaining;
}

