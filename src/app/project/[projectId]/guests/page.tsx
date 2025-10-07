'use client';

import { GuestForm } from '@/components/guests/guest-form';
import { GuestList } from '@/components/guests/guest-list';
import { GuestCounters } from '@/components/guests/guest-counters';
import { GuestActions } from '@/components/guests/guest-actions';

export default function GuestsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Lista de Convidados</h2>
        <p className="text-gray-600 text-sm">Gerencie os convidados do seu casamento</p>
      </div>

      <GuestCounters />
      <GuestForm />
      <GuestActions />
      <GuestList />
    </div>
  );
}
