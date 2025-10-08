'use client';

import { forwardRef, useState, useEffect, type InputHTMLAttributes } from 'react';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: string;
  onChange: (value: string) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      if (value) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          const cents = Math.round(numericValue * 100);
          const formatted = formatCentsAsCurrency(cents);
          setDisplayValue(formatted);
        } else {
          setDisplayValue('');
        }
      } else {
        setDisplayValue('');
      }
    }, []);

    const formatCentsAsCurrency = (cents: number): string => {
      const reais = cents / 100;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(reais);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const digitsOnly = inputValue.replace(/\D/g, '');

      if (digitsOnly === '') {
        setDisplayValue('');
        onChange('');
        return;
      }

      const cents = parseInt(digitsOnly, 10);
      const formatted = formatCentsAsCurrency(cents);
      const decimalValue = (cents / 100).toFixed(2);

      setDisplayValue(formatted);
      onChange(decimalValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
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
  }
);

CurrencyInput.displayName = 'CurrencyInput';
