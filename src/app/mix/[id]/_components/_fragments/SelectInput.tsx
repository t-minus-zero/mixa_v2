"use client"

import { ChangeEvent, useState, useRef, useEffect, ReactNode } from 'react';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
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
        className="ml-1 cursor-pointer p-1 text-gray-500 hover:text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10">
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
        </div>
      )}
      
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
