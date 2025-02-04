'use client';

import { cn } from '@/lib/utils';

interface SelectFieldProps {
  options: { value: string; label: string; }[];
  name: string;
  id: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SelectField({
  options,
  name,
  id,
  defaultValue = '',
  placeholder = 'Select an option',
  className,
}: SelectFieldProps) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      className={cn(
        "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}