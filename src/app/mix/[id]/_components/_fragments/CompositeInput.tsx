"use client"

import { useState, useRef, useEffect, ReactNode } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';

interface CompositeInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  renderItem?: (value: string, index: number) => ReactNode;
}

export default function CompositeInput({
  value = [],
  onChange,
  options,
  placeholder = "Add item...",
  renderItem
}: CompositeInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        addButtonRef.current && 
        !addButtonRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      // Ensure we safely remove the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="w-full space-y-2" ref={listRef}>
      {/* List items */}
      {value.length > 0 && (
        <div className="flex flex-row rounded">
          {value.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center">
              {/* Item content - either custom rendered or default */}
              {renderItem ? renderItem(item, index) : <div className="text-xs">{item}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
