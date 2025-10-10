import { PropsWithChildren } from 'react';
import clsx from 'clsx';

type SectionWidth = 'full' | 'wide' | 'normal' | 'narrow';
type SectionPadding = 'sm' | 'md' | 'lg';

interface SectionProps {
  id?: string;
  ariaLabelledBy?: string;
  borderTop?: boolean;
  backgroundClassName?: string;
  width?: SectionWidth; // controls max width of inner content
  padding?: SectionPadding; // vertical rhythm
  className?: string; // extra classes on outer section
  innerClassName?: string; // extra classes on inner container
}

export function Section({
  id,
  ariaLabelledBy,
  borderTop = false,
  backgroundClassName,
  width = 'wide',
  padding = 'md',
  className,
  innerClassName,
  children,
}: PropsWithChildren<SectionProps>) {
  const paddingClasses =
    padding === 'sm'
      ? 'py-10 md:py-12 lg:py-14'
      : padding === 'md'
        ? 'py-12 md:py-16 lg:py-20'
        : 'py-16 md:py-20 lg:py-24';

  const maxWidthClasses =
    width === 'full'
      ? 'max-w-none'
      : width === 'wide'
        ? 'max-w-[1400px]'
        : width === 'normal'
          ? 'max-w-7xl'
          : 'max-w-4xl';

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={clsx(paddingClasses, borderTop && 'border-t', backgroundClassName, className)}
    >
      <div
        className={clsx('mx-auto w-full px-4 md:px-8 lg:px-12', maxWidthClasses, innerClassName)}
      >
        {children}
      </div>
    </section>
  );
}
