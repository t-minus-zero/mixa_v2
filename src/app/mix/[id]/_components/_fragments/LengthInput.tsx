"use client"

import { useState, useEffect, type ChangeEvent } from 'react';
import type { ComponentType, SVGProps } from 'react';
import InputContainer from './InputContainer';
import NumberInput from './NumberInput';
import UnitSelect from './UnitSelect';
import Divider from './Divider';

// Define the props interface
interface LengthInputProps {
  label: string; // Label to display above the input
  value: string; // e.g., "10px"
  onChange: (newValue: string) => void; // Callback to update parent state
  icon: ComponentType<SVGProps<SVGSVGElement>>; // SVG icon component
  units: string[]; // Array of unit options, e.g., ['px', '%', 'rem']
  min?: number; // Minimum value (optional)
  max?: number; // Maximum value (optional)
}

// Functional component with typed props
export default function LengthInput({ 
  label,
  value, 
  onChange, 
  icon: Icon, 
  units,
  min,
  max
}: LengthInputProps) {
  // State with explicit types
  const [number, setNumber] = useState<string>('');
  const [unit, setUnit] = useState<string>('');

  // Sync state with prop changes
  useEffect(() => {
    const match = value.match(/^(-?\d*\.?\d+)(px|%|rem|em|vh|vw|fr)$/);
    if (match) {
      setNumber(match[1]); // Numeric part
      setUnit(match[2]); // Unit part
    } else {
      setNumber('');
      setUnit(units[0] ?? 'px'); // Default to first unit or 'px'
    }
  }, [value, units]);

  // Handle number input change
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
    onChange(`${newNumber}${unit}`);
  };

  // Handle unit dropdown change
  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    onChange(`${number}${newUnit}`);
  };

  // JSX rendering
  return (
    <InputContainer label={label}>
      <Icon className="w-3 h-3 text-gray-500" />
      <Divider />
      <NumberInput 
        value={number} 
        onChange={handleNumberChange}
        min={min}
        max={max}
      />
      <Divider />
      <UnitSelect value={unit} onChange={handleUnitChange} units={units} />
    </InputContainer>
  );
}