'use client';

import { useState } from 'react';
import { Dialog } from './dialog';
import { CurrencyInput } from './currency-input';

interface PromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title?: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: 'text' | 'currency';
}

export function PromptDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Entrada',
  message,
  defaultValue = '',
  placeholder = '',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  inputType = 'text',
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
    setValue(defaultValue);
  };

  const handleClose = () => {
    onClose();
    setValue(defaultValue);
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        {inputType === 'currency' ? (
          <CurrencyInput
            value={value}
            onChange={setValue}
            placeholder={placeholder || 'R$ 0,00'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
              if (e.key === 'Escape') {
                handleClose();
              }
            }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirm();
              }
              if (e.key === 'Escape') {
                handleClose();
              }
            }}
          />
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
