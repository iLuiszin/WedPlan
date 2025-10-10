import { Suspense } from 'react';
import { GuestForm } from '@/features/guests/components/guest-form';
import { GuestListClient } from '@/features/guests/components/guest-list-client';
import { GuestListSkeleton } from '@/features/guests/components/guest-list-skeleton';
import { GuestCounters } from '@/features/guests/components/guest-counters';
import { getGuestsAction } from '@/features/guests/actions';
import { Footer } from '@/components/layouts/footer';
import { Section } from '@/components/layouts/section';

export const revalidate = 60;

export default async function GuestsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const result = await getGuestsAction(projectId);

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <div className="w-full">
      {/* Heading band */}
      <Section
        ariaLabelledBy="guests-heading"
        width="full"
        padding="sm"
        backgroundClassName="bg-gradient-to-b from-white to-cream"
      >
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2
            id="guests-heading"
            className="text-2xl md:text-3xl font-display font-bold text-navy mb-2"
          >
            Lista de Convidados
          </h2>
          <p className="text-navy-light text-sm">Gerencie os convidados do seu casamento</p>
        </div>
      </Section>

      {/* Content */}
      <Section width="full" padding="md">
        <div className="space-y-6">
          <GuestCounters projectId={projectId} initialData={result.data} />
          <GuestForm projectId={projectId} />
          <Suspense fallback={<GuestListSkeleton />}>
            <GuestListClient projectId={projectId} initialData={result.data} />
          </Suspense>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t">
        <Footer />
      </footer>
    </div>
  );
}
