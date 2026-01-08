import { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full px-4 py-3 rounded-xl border border-stone-200',
          'focus:outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20',
          'transition-colors duration-200',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>{error}</p>
      )}
    </div>
  );
}

