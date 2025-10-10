export function BudgetListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-lg h-32 shadow-sm"
          aria-label="Loading budget"
        />
      ))}
    </div>
  );
}
