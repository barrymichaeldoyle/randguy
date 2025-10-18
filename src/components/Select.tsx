import React from "react";
import { cn } from "@/lib/utils";

interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
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
  className = "",
}: SelectProps<T>) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn(
        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition bg-white",
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
