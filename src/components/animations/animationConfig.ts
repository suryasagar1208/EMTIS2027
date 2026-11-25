import type { Transition, Variants } from 'framer-motion';

/**
 * Central animation preset configuration.
 * Custom animation code or third-party presets supplied later can be
 * registered or swapped here without modifying page layouts.
 */
export const MOTION_TIMING = {
  ease: [0.22, 1, 0.36, 1] as const,
  duration: 0.48,
  fastDuration: 0.25,
  staggerDelay: 0.06,
};

export const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TIMING.duration,
      ease: MOTION_TIMING.ease,
    },
  },
};

export const STAGGER_CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: MOTION_TIMING.staggerDelay,
    },
  },
};

export const STAGGER_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: MOTION_TIMING.ease,
    },
  },
};

export const HOVER_TRANSITION: Transition = {
  duration: MOTION_TIMING.fastDuration,
  ease: MOTION_TIMING.ease,
};

