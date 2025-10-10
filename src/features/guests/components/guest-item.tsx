'use client';

import { useState, memo, useCallback } from 'react';
import {
  useUpdateGuest,
  useDeleteGuest,
  useLinkPartners,
  useUnlinkPartner,
  useGuests,
} from '../hooks/use-guests';
import { useProjectContext } from '@/features/projects/components/project-context';
import { useModal } from '@/contexts/modal-context';
import { CATEGORY_LABELS, ROLE_LABELS, GUEST_CATEGORIES } from '@/lib/constants';
import { EditHoverIcon } from '@/components/ui/edit-hover-icon';
import type { GuestCategory, GuestRole } from '@/schemas/guest-schema';
import type { SerializedGuest } from '../types';

interface GuestItemProps {
  guest: SerializedGuest;
}

function GuestItemComponent({ guest }: GuestItemProps) {
  const { projectId } = useProjectContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(guest.firstName);
  const [editedLastName, setEditedLastName] = useState(guest.lastName);
  const [isLinkingPartner, setIsLinkingPartner] = useState(false);

  const { data: allGuests } = useGuests(projectId);
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();
  const linkPartners = useLinkPartners();
  const unlinkPartner = useUnlinkPartner();
  const { showAlert, showConfirm } = useModal();

  const handleNameSave = useCallback(async () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      await showAlert({ message: 'Nome e sobrenome são obrigatórios' });
      return;
    }

    await updateGuest.mutateAsync({
      _id: guest._id.toString(),
      firstName: editedFirstName.trim(),
      lastName: editedLastName.trim(),
    });
    setIsEditingName(false);
  }, [editedFirstName, editedLastName, guest._id, updateGuest, showAlert]);

  const handleNameCancel = useCallback(() => {
    setEditedFirstName(guest.firstName);
    setEditedLastName(guest.lastName);
    setIsEditingName(false);
  }, [guest.firstName, guest.lastName]);

  const cycleCategory = useCallback(async () => {
    const categories: GuestCategory[] = ['both', 'groom', 'bride'];
    const currentIndex = categories.indexOf(guest.category);
    const nextCategory = categories[(currentIndex + 1) % categories.length];

    await updateGuest.mutateAsync({
      _id: guest._id.toString(),
      category: nextCategory,
    });
  }, [guest.category, guest._id, updateGuest]);

  const handleRoleChange = useCallback(async (role: GuestRole) => {
    await updateGuest.mutateAsync({
      _id: guest._id.toString(),
      role,
    });
  }, [guest._id, updateGuest]);

  const handleDelete = useCallback(async () => {
    const confirmed = await showConfirm({
      message: `Tem certeza que deseja remover ${guest.firstName} ${guest.lastName}?`,
      variant: 'danger',
      confirmText: 'Remover',
    });

    if (confirmed) {
      await deleteGuest.mutateAsync(guest._id.toString());
    }
  }, [guest.firstName, guest.lastName, guest._id, showConfirm, deleteGuest]);

  const handleLinkPartner = useCallback(async (partnerId: string) => {
    await linkPartners.mutateAsync({ aId: guest._id.toString(), bId: partnerId });
    setIsLinkingPartner(false);
  }, [guest._id, linkPartners]);

  const handleUnlinkPartner = useCallback(async () => {
    const confirmed = await showConfirm({
      message: 'Deseja desvincular este casal?',
      variant: 'danger',
      confirmText: 'Desvincular',
    });

    if (confirmed) {
      await unlinkPartner.mutateAsync(guest._id.toString());
    }
  }, [guest._id, showConfirm, unlinkPartner]);

  const getCategoryColor = (category: GuestCategory) => {
    switch (category) {
      case GUEST_CATEGORIES.GROOM:
        return 'bg-blue-500 hover:bg-blue-600';
      case GUEST_CATEGORIES.BRIDE:
        return 'bg-pink-500 hover:bg-pink-600';
      case GUEST_CATEGORIES.BOTH:
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const partner = allGuests?.find((g) => g._id.toString() === guest.partnerId?.toString());
  const availablePartners = allGuests?.filter(
    (g) => g._id.toString() !== guest._id.toString() && !g.partnerId
  );

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      {/* Mobile: 2-row layout | Desktop: Single row */}

      {/* Mobile Top Row: Name (left) + Category (right) - Hidden on desktop */}
      <div className="flex md:hidden items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded flex-1 min-w-0 text-sm"
                placeholder="Nome"
                autoFocus
              />
              <input
                type="text"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded flex-1 min-w-0 text-sm"
                placeholder="Sobrenome"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
              />
              <button
                onClick={handleNameSave}
                className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 shrink-0"
              >
                ✓
              </button>
              <button
                onClick={handleNameCancel}
                className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 shrink-0"
              >
                ✕
              </button>
            </div>
          ) : (
            <span
              className="font-semibold text-gray-800 cursor-pointer hover:text-primary block truncate group"
              onClick={() => setIsEditingName(true)}
              title="Clique para editar"
            >
              <span className="inline-flex items-center gap-1 max-w-full">
                <span className="truncate">
                  {guest.firstName} {guest.lastName}
                </span>
                <EditHoverIcon className="shrink-0" />
              </span>
            </span>
          )}
        </div>
        <button
          onClick={cycleCategory}
          className={`px-3 py-1 rounded-full text-white text-sm font-medium transition shrink-0 ${getCategoryColor(
            guest.category
          )}`}
          title="Clique para alternar categoria"
        >
          {CATEGORY_LABELS[guest.category]}
        </button>
      </div>

      {/* Desktop: Single row layout - Hidden on mobile */}
      <div className="hidden md:flex md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded flex-1 min-w-0"
                placeholder="Nome"
                autoFocus
              />
              <input
                type="text"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded flex-1 min-w-0"
                placeholder="Sobrenome"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
              />
              <button
                onClick={handleNameSave}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 shrink-0"
              >
                ✓
              </button>
              <button
                onClick={handleNameCancel}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 shrink-0"
              >
                ✕
              </button>
            </div>
          ) : (
            <span
              className="font-semibold text-gray-800 cursor-pointer hover:text-primary block truncate group"
              onClick={() => setIsEditingName(true)}
              title="Clique para editar"
            >
              <span className="inline-flex items-center gap-1 max-w-full">
                <span className="truncate">
                  {guest.firstName} {guest.lastName}
                </span>
                <EditHoverIcon className="shrink-0" />
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={cycleCategory}
            className={`px-3 py-1 rounded-full text-white text-sm font-medium transition shrink-0 ${getCategoryColor(
              guest.category
            )}`}
            title="Clique para alternar categoria"
          >
            {CATEGORY_LABELS[guest.category]}
          </button>

          <select
            value={guest.role}
            onChange={(e) => handleRoleChange(e.target.value as GuestRole)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
          >
            <option value="guest">{ROLE_LABELS.guest}</option>
            <option value="groomsman">{ROLE_LABELS.groomsman}</option>
            <option value="bridesmaid">{ROLE_LABELS.bridesmaid}</option>
          </select>

          {partner ? (
            <div className="flex items-center text-sm min-w-36 relative h-6 bg-gray-100 rounded px-2 py-1">
              <span className="text-gray-600 truncate max-w-28 absolute left-1/2 -translate-x-1/2">
                💑 {partner.firstName} {partner.lastName}
              </span>
              <button
                onClick={handleUnlinkPartner}
                className="text-red-500 hover:text-red-700 text-xs absolute right-1.5"
                title="Desvincular casal"
              >
                ✕
              </button>
            </div>
          ) : isLinkingPartner ? (
            <div className="flex items-center gap-2 min-w-36">
              <select
                onChange={(e) => e.target.value && handleLinkPartner(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm min-w-0"
                defaultValue=""
              >
                <option value="">Selecione...</option>
                {availablePartners?.map((g) => (
                  <option key={g._id.toString()} value={g._id.toString()}>
                    {g.firstName} {g.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsLinkingPartner(false)}
                className="text-gray-500 hover:text-gray-700 text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLinkingPartner(true)}
              className="min-w-36 px-2 py-1 text-xs text-primary hover:text-primary-dark border border-primary rounded"
              title="Vincular como casal"
            >
              + Casal
            </button>
          )}

          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition shrink-0"
          >
            Remover
          </button>
        </div>
      </div>

      {/* Mobile Vertical Stack Layout - Hidden on desktop */}
      <div className="flex md:hidden flex-col gap-2">
        {/* Row 1: Role Select - Full Width */}
        <select
          value={guest.role}
          onChange={(e) => handleRoleChange(e.target.value as GuestRole)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="guest">{ROLE_LABELS.guest}</option>
          <option value="groomsman">{ROLE_LABELS.groomsman}</option>
          <option value="bridesmaid">{ROLE_LABELS.bridesmaid}</option>
        </select>

        {/* Row 2: Partner Section - Full Width */}
        {partner ? (
          <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Parceiro(a)</p>
                <p className="text-sm font-medium text-gray-800">
                  💑 {partner.firstName} {partner.lastName}
                </p>
              </div>
            </div>
            <button
              onClick={handleUnlinkPartner}
              className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded transition"
            >
              Desvincular Casal
            </button>
          </div>
        ) : isLinkingPartner ? (
          <div className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Selecionar Parceiro(a)</p>
              <button
                onClick={() => setIsLinkingPartner(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
                title="Fechar"
              >
                ✕
              </button>
            </div>
            <select
              onChange={(e) => e.target.value && handleLinkPartner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              defaultValue=""
            >
              <option value="">Selecione...</option>
              {availablePartners?.map((g) => (
                <option key={g._id.toString()} value={g._id.toString()}>
                  {g.firstName} {g.lastName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <button
            onClick={() => setIsLinkingPartner(true)}
            className="w-full px-3 py-2 text-sm text-primary hover:text-primary-dark border border-primary hover:border-primary-dark rounded transition"
          >
            + Adicionar Parceiro(a)
          </button>
        )}

        {/* Row 3: Delete Button - Full Width */}
        <button
          onClick={handleDelete}
          className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
        >
          Remover
        </button>
      </div>
    </div>
  );
}

export const GuestItem = memo(GuestItemComponent);
