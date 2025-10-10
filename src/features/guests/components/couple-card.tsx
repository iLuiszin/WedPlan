'use client';

import { memo, useCallback } from 'react';
import { useUnlinkPartner } from '../hooks/use-guests';
import { useModal } from '@/contexts/modal-context';
import { CATEGORY_LABELS, ROLE_LABELS, GUEST_CATEGORIES } from '@/lib/constants';
import type { GuestCategory } from '@/schemas/guest-schema';
import type { SerializedGuest } from '../types';

interface CoupleCardProps {
  partnerA: SerializedGuest;
  partnerB: SerializedGuest;
}

function CoupleCardComponent({ partnerA, partnerB }: CoupleCardProps) {
  const unlinkPartner = useUnlinkPartner();
  const { showConfirm } = useModal();

  const handleUnlink = useCallback(async () => {
    const confirmed = await showConfirm({
      message: `Deseja desvincular o casal ${partnerA.firstName} & ${partnerB.firstName}?`,
      variant: 'danger',
      confirmText: 'Desvincular',
    });

    if (confirmed) {
      await unlinkPartner.mutateAsync(partnerA._id.toString());
    }
  }, [partnerA.firstName, partnerA._id, partnerB.firstName, showConfirm, unlinkPartner]);

  const getCategoryColor = (category: GuestCategory) => {
    switch (category) {
      case GUEST_CATEGORIES.GROOM:
        return 'bg-blue-500';
      case GUEST_CATEGORIES.BRIDE:
        return 'bg-pink-500';
      case GUEST_CATEGORIES.BOTH:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white border-2 border-purple-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Partner A */}
        <div className="flex-1 text-center sm:text-right">
          <h4 className="font-semibold text-gray-800 text-lg">
            {partnerA.firstName} {partnerA.lastName}
          </h4>
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(
                partnerA.category
              )}`}
            >
              {CATEGORY_LABELS[partnerA.category]}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {ROLE_LABELS[partnerA.role]}
            </span>
          </div>
        </div>

        {/* Heart Divider */}
        <div className="flex items-center justify-center">
          <span className="text-3xl text-pink-500">💑</span>
        </div>

        {/* Partner B */}
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-semibold text-gray-800 text-lg">
            {partnerB.firstName} {partnerB.lastName}
          </h4>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(
                partnerB.category
              )}`}
            >
              {CATEGORY_LABELS[partnerB.category]}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
              {ROLE_LABELS[partnerB.role]}
            </span>
          </div>
        </div>

        {/* Unlink Button */}
        <button
          onClick={handleUnlink}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition whitespace-nowrap"
          title="Desvincular casal"
        >
          Desvincular
        </button>
      </div>
    </div>
  );
}

export const CoupleCard = memo(CoupleCardComponent);
