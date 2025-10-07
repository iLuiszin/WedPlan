'use client';

import { useGuests } from '@/hooks/use-guests';
import { useProjectContext } from '@/components/projects/project-context';
import { GUEST_CATEGORIES, GUEST_ROLES } from '@/lib/constants';

export function GuestCounters() {
  const { projectId } = useProjectContext();
  const { data: guests } = useGuests(projectId);

  if (!guests) {
    return null;
  }

  const totalGuests = guests.length;
  const totalGroom = guests.filter((g) => g.category === GUEST_CATEGORIES.GROOM).length;
  const totalBride = guests.filter((g) => g.category === GUEST_CATEGORIES.BRIDE).length;
  const totalBoth = guests.filter((g) => g.category === GUEST_CATEGORIES.BOTH).length;
  const totalGroomsmen = guests.filter((g) => g.role === GUEST_ROLES.GROOMSMAN).length;
  const totalBridesmaids = guests.filter((g) => g.role === GUEST_ROLES.BRIDESMAID).length;

  // Count couples (guests with partners)
  const coupleIds = new Set<string>();
  guests.forEach((guest) => {
    if (guest.partnerId) {
      const pair = [guest._id.toString(), guest.partnerId.toString()].sort().join('-');
      coupleIds.add(pair);
    }
  });
  const totalCouples = coupleIds.size;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Estatísticas</h3>
        <div className="text-3xl font-bold text-primary">{totalGuests}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-500">{totalGroom}</div>
          <div className="text-sm text-gray-600">Noivo</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-pink-500">{totalBride}</div>
          <div className="text-sm text-gray-600">Noiva</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-500">{totalBoth}</div>
          <div className="text-sm text-gray-600">Ambos</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalGroomsmen}</div>
          <div className="text-sm text-gray-600">Padrinhos</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-pink-600">{totalBridesmaids}</div>
          <div className="text-sm text-gray-600">Madrinhas</div>
        </div>

        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{totalCouples}</div>
          <div className="text-sm text-gray-600">Casais</div>
        </div>
      </div>
    </div>
  );
}
