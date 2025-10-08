'use client';

import { useState } from 'react';
import { Types } from 'mongoose';
import { FIELD_TYPES, FIELD_TYPE_LABELS, type FieldType } from '@/lib/constants';
import type { ICategoryField } from '@/models/budget';

interface FieldEditorProps {
  fields: ICategoryField[];
  onChange: (fields: ICategoryField[]) => void;
}

const fieldTypeEntries = Object.entries(FIELD_TYPE_LABELS) as Array<
  [FieldType, (typeof FIELD_TYPE_LABELS)[FieldType]]
>;

export function FieldEditor({ fields, onChange }: FieldEditorProps) {
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>(FIELD_TYPES.TEXT);
  const [isExpense, setIsExpense] = useState(false);

  const handleExpenseChange = (checked: boolean) => {
    setIsExpense(checked);
    if (checked) {
      setNewFieldType(FIELD_TYPES.CURRENCY);
    }
  };

  const getInputType = (): string => {
    switch (newFieldType) {
      case FIELD_TYPES.DATE:
        return 'date';
      case FIELD_TYPES.NUMBER:
      case FIELD_TYPES.CURRENCY:
        return 'number';
      default:
        return 'text';
    }
  };

  const getInputProps = () => {
    if (newFieldType === FIELD_TYPES.CURRENCY) {
      return { step: '0.01', placeholder: 'R$ 0,00' };
    }
    if (newFieldType === FIELD_TYPES.NUMBER) {
      return { step: '1', placeholder: '0' };
    }
    if (newFieldType === FIELD_TYPES.DATE) {
      return { placeholder: 'dd/mm/aaaa' };
    }
    return { placeholder: 'Valor' };
  };

  const handleAddField = () => {
    const trimmedKey = newFieldKey.trim();
    if (!trimmedKey) {
      return;
    }

    const field: ICategoryField = {
      _id: new Types.ObjectId(new Date().getTime().toString(16).padStart(24, '0')),
      key: trimmedKey,
      value: newFieldValue.trim(),
      fieldType: newFieldType,
      itemType: isExpense ? 'expense' : 'information',
    };

    onChange([...fields, field]);
    setNewFieldKey('');
    setNewFieldValue('');
    setNewFieldType(FIELD_TYPES.TEXT);
    setIsExpense(false);
  };

  const handleUpdateField = (index: number, updates: Partial<ICategoryField>) => {
    const nextFields = fields.map((field, currentIndex) =>
      currentIndex === index ? { ...field, ...updates } : field
    );
    onChange(nextFields);
  };

  const handleDeleteField = (index: number) => {
    onChange(fields.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleTypeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (
      value === FIELD_TYPES.TEXT ||
      value === FIELD_TYPES.NUMBER ||
      value === FIELD_TYPES.CURRENCY ||
      value === FIELD_TYPES.DATE
    ) {
      setNewFieldType(value);
    }
  };

  const formatFieldValue = (field: ICategoryField): string => {
    if (!field.value) {
      return '-';
    }

    switch (field.fieldType) {
      case FIELD_TYPES.CURRENCY: {
        const numeric = Number.parseFloat(field.value);
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Number.isNaN(numeric) ? 0 : numeric);
      }
      case FIELD_TYPES.DATE: {
        const date = new Date(field.value);
        return Number.isNaN(date.getTime()) ? field.value : date.toLocaleDateString('pt-BR');
      }
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
                {field.itemType === 'expense' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Despesa
                  </span>
                )}
                {field.itemType === 'information' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Info
                  </span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    const response = prompt(`Editar "${field.key}"`, field.value);
                    if (response !== null) {
                      handleUpdateField(index, { value: response });
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Nome do campo"
              value={newFieldKey}
              onChange={(event) => setNewFieldKey(event.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type={getInputType()}
              {...getInputProps()}
              value={newFieldValue}
              onChange={(event) => setNewFieldValue(event.target.value)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={newFieldType}
              onChange={handleTypeSelect}
              disabled={isExpense}
              className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {fieldTypeEntries.map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddField}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark whitespace-nowrap"
            >
              + Campo
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="expense-checkbox"
              checked={isExpense}
              onChange={(e) => handleExpenseChange(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <label htmlFor="expense-checkbox" className="text-sm text-gray-700 cursor-pointer select-none">
              É uma despesa?
            </label>
            {isExpense && (
              <span className="text-xs text-gray-500 italic">
                (Despesas são sempre em moeda R$)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
