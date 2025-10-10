import { notFound } from 'next/navigation';
import { getProjectAction } from '@/features/projects/actions';
import { ProjectProvider } from '@/features/projects/components/project-context';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const result = await getProjectAction(projectId);

  if (!result.success) {
    notFound();
  }

  return <ProjectProvider projectId={projectId}>{children}</ProjectProvider>;
}
