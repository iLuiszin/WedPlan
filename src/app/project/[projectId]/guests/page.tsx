import { Suspense } from 'react';
import { GuestForm } from '@/components/guests/guest-form';
import { GuestListClient } from '@/components/guests/guest-list-client';
import { GuestListSkeleton } from '@/components/guests/guest-list-skeleton';
import { GuestCounters } from '@/components/guests/guest-counters';
import { getGuestsAction } from '@/actions/guest-actions';

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const result = await getGuestsAction(projectId);

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Lista de Convidados</h2>
        <p className="text-gray-600 text-sm">Gerencie os convidados do seu casamento</p>
      </div>

      <GuestCounters projectId={projectId} initialData={result.data} />
      <GuestForm projectId={projectId} />
      <Suspense fallback={<GuestListSkeleton />}>
        <GuestListClient projectId={projectId} initialData={result.data} />
      </Suspense>
    </div>
  );
}
