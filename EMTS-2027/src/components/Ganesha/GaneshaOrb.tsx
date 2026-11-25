import { motion, useReducedMotion } from 'framer-motion';

export type GaneshaState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface GaneshaOrbProps {
  state: GaneshaState;
  audioLevel?: number;
}

const STATE_LABELS: Record<GaneshaState, string> = {
  idle: 'Ready to help',
  listening: 'Listening...',
  thinking: 'Searching brochure...',
  speaking: 'Speaking...',
};

export function GaneshaOrb({ state, audioLevel = 0 }: GaneshaOrbProps) {
  const prefersReduced = useReducedMotion();
  const dynamicScale =
    state === 'listening'
      ? 1 + Math.min(audioLevel * 0.28, 0.24)
      : state === 'speaking'
        ? 1.08
        : 1;

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
        {/* Outer pulse ring */}
        <motion.div
          animate={
            prefersReduced
              ? {}
              : state === 'listening'
                ? { scale: [1, 1.26, 1], opacity: [0.45, 0.15, 0.45] }
                : state === 'speaking'
                  ? { scale: [1, 1.18, 1], opacity: [0.4, 0.2, 0.4] }
                  : state === 'thinking'
                    ? { rotate: 360 }
                    : { scale: [1, 1.06, 1], opacity: [0.25, 0.12, 0.25] }
          }
          transition={{
            duration: state === 'thinking' ? 2.4 : state === 'listening' ? 1.2 : 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full border-2 ${
            state === 'listening'
              ? 'border-emerald-400/70'
              : state === 'speaking'
                ? 'border-amber-300/75'
                : state === 'thinking'
                  ? 'border-dashed border-sky-300/80'
                  : 'border-white/25'
          }`}
          aria-hidden="true"
        />

        {/* Secondary glow ring */}
        <motion.div
          animate={
            prefersReduced
              ? {}
              : { scale: dynamicScale }
          }
          transition={{ duration: 0.18 }}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full shadow-2xl sm:h-24 sm:w-24 ${
            state === 'listening'
              ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-700'
              : state === 'speaking'
                ? 'bg-gradient-to-br from-amber-300 via-rose-500 to-indigo-700'
                : state === 'thinking'
                  ? 'bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-700'
                  : 'bg-gradient-to-br from-rose-400 via-red-800 to-slate-900'
          }`}
        >
          <div className="absolute inset-1.5 rounded-full bg-white/15 backdrop-blur-sm" />
          <span className="relative font-serif text-xl font-bold tracking-wider text-white sm:text-2xl">
            G
          </span>
        </motion.div>
      </div>

      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-0.5 font-mono text-[11px] font-medium tracking-wider text-white/90">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            state === 'listening'
              ? 'bg-emerald-400'
              : state === 'speaking'
                ? 'bg-amber-300'
                : state === 'thinking'
                  ? 'bg-sky-400'
                  : 'bg-white/60'
          }`}
          aria-hidden="true"
        />
        {STATE_LABELS[state]}
      </span>
    </div>
  );
}

