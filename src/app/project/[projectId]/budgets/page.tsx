'use client';

import { BudgetForm } from '@/components/budgets/budget-form';
import { BudgetList } from '@/components/budgets/budget-list';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Orçamentos</h2>
        <p className="text-gray-600 text-sm">Gerencie os orçamentos do seu casamento</p>
      </div>

      <BudgetForm />
      <BudgetList />
    </div>
  );
}
