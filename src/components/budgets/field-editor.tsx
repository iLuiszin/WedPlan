'use client';

import { useState } from 'react';
import { FIELD_TYPES, FIELD_TYPE_LABELS } from '@/lib/constants';
import type { ICategoryField } from '@/models/budget';
import type { FieldType } from '@/lib/constants';

interface FieldEditorProps {
  fields: ICategoryField[];
  onChange: (fields: ICategoryField[]) => void;
}

export function FieldEditor({ fields, onChange }: FieldEditorProps) {
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>(FIELD_TYPES.TEXT);

  const handleAddField = () => {
    if (!newFieldKey.trim()) return;

    const newField: ICategoryField = {
      _id: new Date().getTime().toString(16).padStart(24, '0') as any,
      key: newFieldKey.trim(),
      value: newFieldValue.trim(),
      fieldType: newFieldType,
    };

    onChange([...fields, newField]);
    setNewFieldKey('');
    setNewFieldValue('');
    setNewFieldType(FIELD_TYPES.TEXT);
  };

  const handleUpdateField = (index: number, updates: Partial<ICategoryField>) => {
    const updated = fields.map((field, i) => (i === index ? { ...field, ...updates } : field));
    onChange(updated);
  };

  const handleDeleteField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const formatFieldValue = (field: ICategoryField): string => {
    if (!field.value) return '-';

    switch (field.fieldType) {
      case FIELD_TYPES.CURRENCY:
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(parseFloat(field.value) || 0);
      case FIELD_TYPES.DATE:
        return new Date(field.value).toLocaleDateString('pt-BR');
      case FIELD_TYPES.NUMBER:
        return field.value;
      case FIELD_TYPES.TEXT:
      default:
        return field.value;
    }
  };

  return (
    <div className="space-y-3">
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field._id.toString()}
              className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-gray-50 rounded"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700">{field.key}:</span>{' '}
                <span className="text-sm text-gray-900">{formatFieldValue(field)}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({FIELD_TYPE_LABELS[field.fieldType]})
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    const newValue = prompt(`Editar "${field.key}"`, field.value);
                    if (newValue !== null) {
                      handleUpdateField(index, { value: newValue });
                    }
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteField(index)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t pt-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">Adicionar Campo</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nome do campo"
            value={newFieldKey}
            onChange={(e) => setNewFieldKey(e.target.value)}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Valor"
            value={newFieldValue}
            onChange={(e) => setNewFieldValue(e.target.value)}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value as FieldType)}
            className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(FIELD_TYPE_LABELS).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddField}
            className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark whitespace-nowrap"
          >
            + Campo
          </button>
        </div>
      </div>
    </div>
  );
}
