'use client';

import { Dialog } from './dialog';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function AlertDialog({ isOpen, onClose, title = 'Atenção', message }: AlertDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            OK
          </button>
        </div>
      </div>
    </Dialog>
  );
}
