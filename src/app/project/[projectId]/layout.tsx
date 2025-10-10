import { notFound } from 'next/navigation';
import { getProjectAction } from '@/features/projects/actions';
import { ProjectProvider } from '@/features/projects/components/project-context';
import { RecentProjectWriter } from '@/features/projects/components/recent-project-writer';
import type { SerializedDocument } from '@/types/mongoose-helpers';
import type { IProject } from '@/models/project';

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

  const p = result.data as SerializedDocument<IProject>;

  return (
    <ProjectProvider projectId={projectId}>
      {/* Persist project in recent projects (client side) */}
      <RecentProjectWriter
        project={{
          _id: p._id,
          slug: (p as unknown as IProject).slug,
          brideFirstName: (p as unknown as IProject).brideFirstName,
          groomFirstName: (p as unknown as IProject).groomFirstName,
        }}
      />
      {children}
    </ProjectProvider>
  );
}
