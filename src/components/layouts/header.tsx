'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProject } from '@/features/projects/hooks/use-project';
import { memo } from 'react';

const brandConfig = {
  href: '/',
  label: 'WedPlan',
  image: {
    alt: 'Logotipo WedPlan com coracao e alianca',
    height: 48,
    src: '/logo.svg',
    width: 48,
  },
};

const brandTitleClass = 'text-2xl md:text-3xl font-script text-primary';
const brandTitleLargeClass = 'text-3xl md:text-4xl font-script text-primary';

type BrandProps = {
  titleClassName?: string;
};

function Brand({ titleClassName = brandTitleClass }: BrandProps) {
  return (
    <h1 className={titleClassName}>
      <Link
        href={brandConfig.href}
        className="flex items-center justify-center hover:opacity-80 transition"
        aria-label={brandConfig.label}
      >
        <div className="inline-grid grid-cols-[48px_auto_48px] md:grid-cols-[56px_auto_56px] items-center translate-x-4">
          <Image
            src={brandConfig.image.src}
            alt={brandConfig.image.alt}
            width={brandConfig.image.width}
            height={brandConfig.image.height}
            className="h-12 w-12 md:h-14 md:w-14"
            priority
          />
          <span className="-ml-1 mt-1.5">{brandConfig.label}</span>
          <div className="w-12 md:w-14" />
        </div>
      </Link>
    </h1>
  );
}

function HeaderComponent() {
  const pathname = usePathname();

  const projectIdMatch = pathname.match(/^\/project\/([^/]+)/);
  const projectId = projectIdMatch?.[1];

  const { data: project } = useProject(projectId || '');

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {projectId ? (
          project ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
              <Brand />
              <div className="text-center sm:text-right">
                <p className="text-base md:text-xl font-display font-semibold text-navy">
                  {project.brideFirstName} & {project.groomFirstName}
                </p>
                {project.weddingDate && (
                  <p className="text-xs md:text-sm text-navy-light">
                    {new Date(project.weddingDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <Brand />
          )
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <Brand titleClassName={brandTitleLargeClass} />
              <p className="text-sm text-navy-light mt-1 text-center">Planeje seu dia perfeito</p>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export const Header = memo(HeaderComponent);
