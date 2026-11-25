import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  HOVER_TRANSITION,
  REVEAL_VARIANTS,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS,
} from './animationConfig';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Modular scroll-reveal wrapper.
 * Automatically degrades to static rendering when prefers-reduced-motion is enabled.
 */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.02 }}
      variants={REVEAL_VARIANTS}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
}

export function StaggerGroup({ children, className = '' }: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.02 }}
      variants={STAGGER_CONTAINER_VARIANTS}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={STAGGER_ITEM_VARIANTS} className={className}>
      {children}
    </motion.div>
  );
}

interface InteractiveSurfaceProps {
  children: ReactNode;
  className?: string;
}

export function InteractiveSurface({ children, className = '' }: InteractiveSurfaceProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={HOVER_TRANSITION}
      className={className}
    >
      {children}
    </motion.div>
  );
}

