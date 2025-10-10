export function GuestListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-lg h-20 shadow-sm"
          aria-label="Loading guest"
        />
      ))}
    </div>
  );
}
