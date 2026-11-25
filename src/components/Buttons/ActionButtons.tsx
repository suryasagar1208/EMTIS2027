import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Sparkles, Grid3X3 } from 'lucide-react';
import type { ThemeId } from '@/types/conference';

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
}

export function PrimaryButton({
  children,
  className = '',
  ...props
}: BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`theme-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryLinkButton({
  children,
  className = '',
  ...props
}: BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`theme-btn-primary inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export function SecondaryLinkButton({
  children,
  className = '',
  ...props
}: BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={`theme-btn-secondary inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

interface ThemeSwitcherProps {
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  compact?: boolean;
}

export function ThemeSwitcher({ theme, onSelectTheme, compact = false }: ThemeSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Visual design theme"
      className="theme-pill inline-flex shrink-0 items-center bg-surface/60 p-0.5 text-[11px] font-medium sm:text-xs"
    >
      <button
        type="button"
        onClick={() => onSelectTheme('glass')}
        aria-pressed={theme === 'glass'}
        title="Switch to Glassmorphism theme"
        className={`inline-flex min-h-[34px] items-center gap-1 rounded-theme-pill px-1.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-[360px]:px-2 sm:gap-1.5 sm:px-2.5 ${
          theme === 'glass'
            ? 'bg-accent text-white'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        <Sparkles className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <span>{compact ? 'Glass' : 'Glass'}</span>
      </button>
      <button
        type="button"
        onClick={() => onSelectTheme('swiss')}
        aria-pressed={theme === 'swiss'}
        title="Switch to Swiss Design theme"
        className={`inline-flex min-h-[34px] items-center gap-1 rounded-theme-pill px-1.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent min-[360px]:px-2 sm:gap-1.5 sm:px-2.5 ${
          theme === 'swiss'
            ? 'bg-ink text-white'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        <Grid3X3 className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
        <span>{compact ? 'Swiss' : 'Swiss'}</span>
      </button>
    </div>
  );
}
