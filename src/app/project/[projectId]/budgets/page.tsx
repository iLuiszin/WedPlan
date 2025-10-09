import { Suspense } from 'react';
import { BudgetForm } from '@/components/budgets/budget-form';
import { BudgetListClient } from '@/components/budgets/budget-list-client';
import { BudgetListSkeleton } from '@/components/budgets/budget-list-skeleton';
import { getBudgetsAction } from '@/actions/budget-actions';

export const revalidate = 60;

export default async function BudgetsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const result = await getBudgetsAction(projectId);

  if (!result.success) {
    throw new Error(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Orçamentos</h2>
        <p className="text-gray-600 text-sm">Gerencie os orçamentos do seu casamento</p>
      </div>

      <BudgetForm projectId={projectId} />
      <Suspense fallback={<BudgetListSkeleton />}>
        <BudgetListClient projectId={projectId} initialData={result.data} />
      </Suspense>
    </div>
  );
}
