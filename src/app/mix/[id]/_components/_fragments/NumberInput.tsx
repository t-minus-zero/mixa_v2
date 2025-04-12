"use client"

import { ChangeEvent, useRef, useEffect, MouseEvent, useState } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

export default function NumberInput({ value, onChange, min, max }: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  
  // Calculate width based on character count with minimum width of 1.5ch
  const [inputWidth, setInputWidth] = useState('1.5ch'); // Default minimum width

  // Handle click to select all text
  const handleClick = () => {
    inputRef.current?.select();
  };

  // Handle drag to change value
  const handleMouseDown = (e: MouseEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !inputRef.current) return;

    const delta = e.clientX - lastXRef.current;
    const currentValue = parseFloat(inputRef.current.value);
    // If value is not a number, start from 0
    let newValue = (isNaN(currentValue) ? 0 : currentValue) + delta * 0.1;

    // Apply min/max constraints only if they're provided
    if (typeof min === 'number') newValue = Math.max(min, newValue);
    if (typeof max === 'number') newValue = Math.min(max, newValue);

    // Limit to 2 decimal places during dragging
    newValue = Number(newValue.toFixed(2));

    const syntheticEvent = {
      target: {
        value: newValue.toString()
      }
    } as ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    lastXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  // Update width based on character count
  useEffect(() => {
    // Get the number of characters with a minimum of 1
    const charCount = value?.length || 1;
    // Use ch units (width of '0' character) with a minimum of 1.5ch
    const calculatedWidth = `${Math.max(1, charCount + 0.5)}ch`;
    setInputWidth(calculatedWidth);
  }, [value]);

  // Handle regular input change with min/max constraints
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    
    if (isNaN(newValue)) {
      onChange(e);
      return;
    }

    let constrainedValue = newValue;
    if (typeof min === 'number') constrainedValue = Math.max(min, constrainedValue);
    if (typeof max === 'number') constrainedValue = Math.min(max, constrainedValue);

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: constrainedValue.toString()
      }
    };

    onChange(syntheticEvent);
  };

  return (
    <input
      ref={inputRef}
      type="number"
      step="any"
      min={min}
      max={max}
      value={value}
      onChange={handleInputChange}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{ width: inputWidth, transition: 'width 0.1s ease' }}
      className="
        text-xs
        text-gray-500
        bg-transparent 
        outline-none
        text-right
        border-none 
        focus:ring-0 
        text-gray-800
        [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        cursor-ew-resize
      "
      placeholder="0"
    />
  );
}
