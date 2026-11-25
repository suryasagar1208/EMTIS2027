import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--color-accent-strong) / <alpha-value>)',
        'accent-secondary': 'rgb(var(--color-accent-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        theme: 'var(--radius-card)',
        'theme-sm': 'var(--radius-control)',
        'theme-pill': 'var(--radius-pill)',
      },
      boxShadow: {
        theme: 'var(--shadow-card)',
        'theme-hover': 'var(--shadow-card-hover)',
      },
      maxWidth: {
        conference: '80rem',
      },
    },
  },
  plugins: [],
};

export default config;

