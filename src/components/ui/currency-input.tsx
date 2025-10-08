'use client';

import { forwardRef, useState, useEffect, useCallback, type InputHTMLAttributes } from 'react';

interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: string;
  onChange: (value: string) => void;
}

const formatCentsAsCurrency = (cents: number): string => {
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais);
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      if (!value) {
        setDisplayValue('');
        return;
      }

      const numericValue = Number.parseFloat(value);
      if (Number.isNaN(numericValue)) {
        setDisplayValue('');
        return;
      }

      const cents = Math.round(numericValue * 100);
      setDisplayValue(formatCentsAsCurrency(cents));
    }, [value]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = event.target.value.replace(/\D/g, '');

        if (digitsOnly === '') {
          setDisplayValue('');
          onChange('');
          return;
        }

        const cents = Number.parseInt(digitsOnly, 10);
        const formatted = formatCentsAsCurrency(cents);
        const decimalValue = (cents / 100).toFixed(2);

        setDisplayValue(formatted);
        onChange(decimalValue);
      },
      [onChange],
    );

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        className={className}
        {...props}
      />
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
