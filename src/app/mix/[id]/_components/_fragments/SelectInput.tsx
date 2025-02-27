"use client"

import { ChangeEvent } from 'react';

interface SelectInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}

export default function SelectInput({ 
  value, 
  onChange, 
  options,
  placeholder
}: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        text-xs
        text-gray-500
        bg-transparent 
        outline-none 
        border-none 
        focus:ring-0
        appearance-none
      "
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
