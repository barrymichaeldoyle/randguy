import { ReactNode } from "react";

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
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      {children}
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
