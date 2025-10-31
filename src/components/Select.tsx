import { cn } from '@/lib/utils';

import type { SelectHTMLAttributes } from 'react';

interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T>
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'className' | 'children'
  > {
  id?: string;
  value: string;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
}

export function Select<T extends string>({
  id,
  value,
  onChange,
  options,
  className = '',
  ...rest
}: SelectProps<T>) {
  return (
    <div className={cn('relative w-full', className)}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={
          'w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pr-10 pl-4 transition outline-none focus:border-transparent focus:ring-2 focus:ring-yellow-400'
        }
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
