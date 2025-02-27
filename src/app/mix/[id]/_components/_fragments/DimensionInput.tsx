"use client"

import { useState, useEffect, type ChangeEvent } from 'react';
import type { ComponentType, SVGProps } from 'react';
import InputWrapper from './InputWrapper';
import NumberInput from './NumberInput';
import SelectInput from './SelectInput';
import Divider from './Divider';

interface DimensionInputProps {
  // Base props
  value: string;
  onChange: (value: string) => void;
  
  // Optional styling/layout props
  label?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
  isSubProperty?: boolean;
  
  // Validation props
  min?: number;
  max?: number;
  
  // Units configuration
  units?: string[];
}

export default function DimensionInput({ 
  // Base props
  value,
  onChange,
  
  // Optional styling/layout props
  label,
  icon: Icon,
  className = '',
  isSubProperty = false,
  
  // Validation props
  min,
  max,
  
  // Units configuration
  units = ['px', '%', 'rem', 'em', 'vh', 'vw']
}: DimensionInputProps) {
  // State
  const [number, setNumber] = useState<string>('');
  const [unit, setUnit] = useState<string>('');

  // Parse value into number and unit
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

  // Handle unit change
  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    onChange(`${number}${newUnit}`);
  };

  // Render the inner content
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {Icon && (
        <>
          <Icon className="w-4 h-4 text-gray-400" />
          <Divider />
        </>
      )}
      <NumberInput
        value={number}
        onChange={handleNumberChange}
        min={min}
        max={max}
      />
      <SelectInput
        value={unit}
        onChange={handleUnitChange}
        options={units}
      />
    </div>
  );

  // If we have a label, wrap in InputWrapper, otherwise return raw content
  if (label) {
    return (
      <InputWrapper label={label} isSubProperty={isSubProperty}>
        {content}
      </InputWrapper>
    );
  }

  return content;
}
