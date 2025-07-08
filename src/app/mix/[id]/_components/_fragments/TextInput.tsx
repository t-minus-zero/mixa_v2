"use client"

import { ChangeEvent, useRef } from 'react';

// Define the props interface
interface TextInputProps {
  value: string; // Current text value
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Callback to update parent state
  placeholder?: string; // Optional placeholder text
}

// Text input component with consistent styling
export default function TextInput({ 
  value, 
  onChange, 
  placeholder
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click to select all text
  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      onClick={handleClick}
      placeholder={placeholder}
      className="
        bg-transparent 
        outline-none 
        w-32
        border-none 
        focus:ring-0
        text-xs
      "
    />
  );
}
