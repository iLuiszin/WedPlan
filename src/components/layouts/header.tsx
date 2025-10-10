'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useProject } from '@/features/projects/hooks/use-project';
import { Brand } from '@/components/ui/brand';
import { LoginModal } from '@/components/auth/login-modal';

export function Header() {
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const projectIdMatch = pathname.match(/^\/project\/([^/]+)/);
  const projectId = projectIdMatch?.[1];

  const { data: project } = useProject(projectId || '');

  const brandTitleLargeClass = projectId
    ? 'text-xl md:text-2xl'
    : 'text-2xl md:text-3xl lg:text-4xl';

  return (
    <>
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full">
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
                        {new Date(project.weddingDate).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Brand />
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                  >
                    Login
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center text-center flex-1">
                  <Brand titleClassName={brandTitleLargeClass} />
                  <p className="text-sm text-navy-light mt-1 text-center">
                    Planeje seu dia perfeito
                  </p>
                </div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
