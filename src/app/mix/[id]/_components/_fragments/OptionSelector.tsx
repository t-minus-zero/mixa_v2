'use client'

import { useState, useRef, ReactNode, useEffect } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { ChevronsUpDown } from 'lucide-react';

interface OptionSelectorProps {
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  portalExtra?: () => ReactNode; // Function that returns additional content for the portal
}

export default function OptionSelector({ 
  onChange, 
  options,
  placeholder = 'Select an option...',
  className = '',
  children,
  portalExtra
}: OptionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if children are provided for display
  const hasChildren = children !== undefined;

  // Handle option selection
  const handleSelectOption = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  // Handle clicking outside to close dropdown
  const handleClickOutside = () => {
    setIsOpen(false);
  };

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div 
      className={`relative flex items-center rounded-lg overflow-hidden group ${className} ${isOpen ? '' : ''}`} 
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Display the children or placeholder */}
      <div className="flex-grow flex items-center">
        {hasChildren ? (
          <div className="w-full break-words">{children}</div>
        ) : (
          <div className="text-xs text-gray-500">{placeholder}</div>
        )}
      </div>
      
      {/* Toggle icon - absolute positioned and only visible on hover */}
      {false && <div className="absolute right-0 pr-1 top-0 bottom-0 w-10 opacity-0 group-hover:opacity-100 transition-opacity
                    bg-gradient-to-l from-gray-100 to-transparent flex items-center justify-end">
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>}
      
      {/* Dropdown options using Portal */}
      <Portal 
        show={isOpen}
        onClickOutside={handleClickOutside}
        anchorEl={containerRef}
        placement="bottom-start"
        offset={2}
        autoAdjust={true}
        maxHeight={240}
        className="bg-white/95 backdrop-blur-sm border border-zinc-200 rounded-xl shadow-lg overflow-auto z-50 min-w-[8rem]"
        zIndex={50}
      >
        <div className="p-1">
          {/* Regular options */}
          <div className="overflow-y-auto max-h-[200px]">
            {options.map((option) => (
              <div 
                key={option} 
                className="px-3 py-1.5 cursor-pointer text-xs text-zinc-800 rounded-md hover:bg-zinc-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOption(option);
                }}
              >
                {option}
              </div>
            ))}
          </div>
          
          {/* Extra content from portalExtra prop */}
          {portalExtra && (
            <div className="border-t border-zinc-100 mt-1 pt-1 w-full">
              {portalExtra()}
            </div>
          )}
        </div>
      </Portal>
    </div>
  );
}
