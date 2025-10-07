'use client';

import { useState } from 'react';
import { useUpdateGuest, useDeleteGuest } from '@/hooks/use-guests';
import { CATEGORY_LABELS, ROLE_LABELS, GUEST_CATEGORIES } from '@/lib/constants';
import type { IGuest } from '@/models/guest';
import type { GuestCategory, GuestRole } from '@/schemas/guest-schema';

interface GuestItemProps {
  guest: IGuest;
}

export function GuestItem({ guest }: GuestItemProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(guest.firstName);
  const [editedLastName, setEditedLastName] = useState(guest.lastName);

  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  const handleNameSave = async () => {
    if (!editedFirstName.trim() || !editedLastName.trim()) {
      alert('Nome e sobrenome são obrigatórios');
      return;
    }

    await updateGuest.mutateAsync({
      _id: guest._id.toString(),
      firstName: editedFirstName.trim(),
      lastName: editedLastName.trim(),
    });
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedFirstName(guest.firstName);
    setEditedLastName(guest.lastName);
    setIsEditingName(false);
  };

  const cycleCategory = async () => {
    const categories: GuestCategory[] = ['both', 'groom', 'bride'];
    const currentIndex = categories.indexOf(guest.category);
    const nextCategory = categories[(currentIndex + 1) % categories.length];

    await updateGuest.mutateAsync({
      _id: guest._id.toString(),
      category: nextCategory,
    });
  };

  const handleRoleChange = async (role: GuestRole) => {
    await updateGuest.mutateAsync({
      _id: guest._id.toString(),
      role,
    });
  };

  const handleDelete = async () => {
    if (confirm(`Tem certeza que deseja remover ${guest.firstName} ${guest.lastName}?`)) {
      await deleteGuest.mutateAsync(guest._id.toString());
    }
  };

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

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      <div className="flex-1 flex items-center gap-4">
        {/* Name (editable on click) */}
        {isEditingName ? (
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded flex-1"
              placeholder="Nome"
              autoFocus
            />
            <input
              type="text"
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded flex-1"
              placeholder="Sobrenome"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSave();
                if (e.key === 'Escape') handleNameCancel();
              }}
            />
            <button
              onClick={handleNameSave}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              ✓
            </button>
            <button
              onClick={handleNameCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              ✕
            </button>
          </div>
        ) : (
          <span
            className="font-semibold text-gray-800 cursor-pointer hover:text-primary flex-1"
            onClick={() => setIsEditingName(true)}
            title="Clique para editar"
          >
            {guest.firstName} {guest.lastName}
          </span>
        )}

        {/* Category Badge (click to cycle) */}
        <button
          onClick={cycleCategory}
          className={`px-3 py-1 rounded-full text-white text-sm font-medium transition ${getCategoryColor(
            guest.category
          )}`}
          title="Clique para alternar categoria"
        >
          {CATEGORY_LABELS[guest.category]}
        </button>

        {/* Role Select */}
        <select
          value={guest.role}
          onChange={(e) => handleRoleChange(e.target.value as GuestRole)}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="guest">{ROLE_LABELS.guest}</option>
          <option value="groomsman">{ROLE_LABELS.groomsman}</option>
          <option value="bridesmaid">{ROLE_LABELS.bridesmaid}</option>
        </select>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
      >
        Remover
      </button>
    </div>
  );
}
