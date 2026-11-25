import { motion, useReducedMotion } from 'framer-motion';
import type { GaneshaState } from './GaneshaOrb';

interface VoiceWaveformProps {
  state: GaneshaState;
  audioLevel?: number;
}

const BAR_COUNT = 16;
const BAR_WEIGHTS = [
  0.35, 0.55, 0.8, 0.6, 0.95, 0.7, 1.0, 0.85,
  0.9, 0.65, 1.0, 0.75, 0.85, 0.5, 0.65, 0.4,
];

export function VoiceWaveform({ state, audioLevel = 0 }: VoiceWaveformProps) {
  const prefersReduced = useReducedMotion();
  const isActive = state === 'listening' || state === 'speaking';

  return (
    <div
      className="flex h-8 items-center justify-center gap-1 px-2"
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        const weight = BAR_WEIGHTS[i % BAR_WEIGHTS.length];
        const heightPct =
          state === 'listening'
            ? Math.max(18, Math.min(100, 22 + audioLevel * 140 * weight))
            : state === 'speaking'
              ? Math.round(28 + weight * 62)
              : 18;

        return (
          <motion.span
            key={i}
            animate={
              prefersReduced || !isActive
                ? { height: '20%', opacity: 0.35 }
                : state === 'speaking'
                  ? {
                      height: ['24%', `${heightPct}%`, '28%'],
                      opacity: [0.55, 1, 0.55],
                    }
                  : {
                      height: `${heightPct}%`,
                      opacity: 0.9,
                    }
            }
            transition={
              state === 'speaking'
                ? {
                    duration: 0.55 + (i % 4) * 0.12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : { duration: 0.12 }
            }
            className={`w-1 rounded-full ${
              state === 'listening'
                ? 'bg-emerald-400'
                : state === 'speaking'
                  ? 'bg-amber-300'
                  : 'bg-white/35'
            }`}
          />
        );
      })}
    </div>
  );
}

