"use client"

import { ChangeEvent } from 'react';

interface UnitSelectProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  units: string[];
}

export default function UnitSelect({ value, onChange, units }: UnitSelectProps) {
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
      {units.map((u) => (
        <option key={u} value={u}>
          {u}
        </option>
      ))}
    </select>
  );
}
