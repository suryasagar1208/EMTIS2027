import type { ThemeId } from '@/types/conference';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  theme?: ThemeId;
  align?: 'left' | 'center';
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  theme = 'glass',
  align = 'left',
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={`mb-10 sm:mb-12 ${
        isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'
      } ${theme === 'swiss' ? 'border-b border-border/25 pb-6' : ''}`}
    >
      <div
        className={`mb-3 inline-flex items-center gap-2.5 ${
          isCentered ? 'justify-center' : ''
        }`}
      >
        <span className="font-mono text-xs font-semibold tracking-widest text-accent">
          {index}
        </span>
        <span className="h-px w-6 bg-accent-secondary" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

