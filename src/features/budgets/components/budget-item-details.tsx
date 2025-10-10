'use client';

import { useState } from 'react';
import { useModal } from '@/contexts/modal-context';
import { FieldEditor } from './field-editor';
import { formatCurrencyFromCents, getProviderTotalCents } from '../utils/budget-helpers';
import { EditHoverIcon } from '@/components/ui/edit-hover-icon';
import type { IProvider } from '@/models/budget';

const withUpdatedTimestamp = (provider: IProvider): IProvider => {
  return { ...provider, updatedAt: new Date() };
};

interface BudgetItemDetailsProps {
  provider: IProvider;
  onUpdate: (updated: IProvider) => void;
  onDelete: () => void;
}

export function BudgetItemDetails({ provider, onUpdate, onDelete }: BudgetItemDetailsProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(provider.name);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(provider.notes);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showConfirm } = useModal();

  const handleNameSave = () => {
    if (!editedName.trim()) return;
    onUpdate(withUpdatedTimestamp({ ...provider, name: editedName.trim() }));
    setIsEditingName(false);
  };

  const handleNotesSave = () => {
    onUpdate(withUpdatedTimestamp({ ...provider, notes: editedNotes }));
    setIsEditingNotes(false);
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      message: `Tem certeza que deseja remover "${provider.name}"?`,
      variant: 'danger',
      confirmText: 'Remover',
    });

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                onBlur={handleNameSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') {
                    setEditedName(provider.name);
                    setIsEditingName(false);
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <h4
              className="font-semibold text-gray-800 cursor-pointer hover:text-primary group inline-flex items-center gap-1"
              onClick={() => setIsEditingName(true)}
              title="Clique para editar"
            >
              <span className="truncate">{provider.name}</span>
              <EditHoverIcon />
            </h4>
          )}

          <p className="text-sm font-semibold text-primary mt-1">
            {formatCurrencyFromCents(getProviderTotalCents(provider))}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm text-gray-700 hover:text-primary"
          >
            {isExpanded ? '▲ Recolher' : '▼ Expandir'}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Remover
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Campos Personalizados</p>
            <FieldEditor
              fields={provider.fields}
              onChange={(fields) => onUpdate(withUpdatedTimestamp({ ...provider, fields }))}
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Observações</p>
            {isEditingNotes ? (
              <div>
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  onBlur={handleNotesSave}
                  autoFocus
                />
              </div>
            ) : (
              <div
                className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-700 cursor-pointer hover:bg-gray-100 min-h-[60px] relative group"
                onClick={() => setIsEditingNotes(true)}
                title="Clique para editar observacoes"
              >
                <span className="block pr-6 whitespace-pre-wrap">
                  {provider.notes || 'Clique para adicionar observações...'}
                </span>
                <EditHoverIcon className="absolute top-2 right-2 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
