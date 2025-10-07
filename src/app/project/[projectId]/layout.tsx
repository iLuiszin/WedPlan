import { notFound } from 'next/navigation';
import { getProjectAction } from '@/actions/project-actions';
import { ProjectProvider } from '@/components/projects/project-context';

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
