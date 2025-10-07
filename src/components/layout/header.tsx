'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProject } from '@/hooks/use-project';

export function Header() {
  const pathname = usePathname();

  const projectIdMatch = pathname.match(/^\/project\/([^/]+)/);
  const projectId = projectIdMatch?.[1];

  const { data: project } = useProject(projectId || '');

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        {projectId && project ? (
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition">
              <h1 className="text-2xl font-bold text-primary">Wedding Organizer</h1>
            </Link>
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800">
                {project.brideFirstName} & {project.groomFirstName}
              </p>
              {project.weddingDate && (
                <p className="text-sm text-gray-600">
                  {new Date(project.weddingDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary">Wedding Organizer</h1>
            <p className="text-sm text-gray-600 mt-1">Plan your perfect day</p>
          </>
        )}
      </div>
    </header>
  );
}
