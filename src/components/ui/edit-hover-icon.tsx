import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

type EditHoverIconProps = SVGProps<SVGSVGElement>;

export function EditHoverIcon({ className, ...props }: EditHoverIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'w-4 h-4 text-gray-400 opacity-70 transition group-hover:opacity-100 group-focus-within:opacity-100',
        className
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}
