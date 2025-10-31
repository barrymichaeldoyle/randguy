import type { ReactNode } from 'react';

interface FormFieldProps {
  label: ReactNode;
  htmlFor?: string;
  helperText?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  helperText,
  children,
}: FormFieldProps) {
  const labelId = htmlFor ? `${htmlFor}-label` : undefined;

  return (
    <div>
      <label
        id={labelId}
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
