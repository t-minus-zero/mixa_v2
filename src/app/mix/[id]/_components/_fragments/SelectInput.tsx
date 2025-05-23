"use client"

import { ChangeEvent, useState, useRef, ReactNode } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { ChevronsUpDown } from 'lucide-react';

interface SelectInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  children?: ReactNode;
}

export default function SelectInput({ 
  value, 
  onChange, 
  options,
  placeholder,
  children
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle changing selection
  const handleSelectOption = (option: string) => {
    // Create a synthetic event object
    const syntheticEvent = {
      target: {
        value: option
      }
    } as ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  // Handle clicking outside to close dropdown
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {/* Display selected value or children */}
      <div className="flex-grow flex items-center">
        {children ? (
          // If children are provided, only render the children
          children
        ) : (
          // Otherwise render the selected value
          <div className="text-xs text-gray-500">
            {value || placeholder || "Select..."}
          </div>
        )}
      </div>
      
      {/* Toggle button */}
      <div 
        className=" cursor-pointer p-1 text-gray-500 hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <ChevronsUpDown size={12} />
      </div>
      
      {/* Dropdown options using Portal component */}
      <Portal 
        show={isOpen}
        onClickOutside={handleClickOutside}
        anchorEl={containerRef}
        placement="bottom-start"
        offset={2}
        autoAdjust={true}
        maxHeight={200}
        className="bg-white border border-gray-200 rounded shadow-lg overflow-y-auto"
        zIndex={50}
      >
        {options.map((option) => (
          <div 
            key={option} 
            className={`
              px-3 py-2 text-xs cursor-pointer
              ${option === value ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'}
            `}
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </div>
        ))}
      </Portal>
      
      {/* Hidden select for accessibility */}
      <select
        value={value}
        onChange={onChange}
        className="sr-only"
        aria-hidden="true"
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
    </div>
  );
}
