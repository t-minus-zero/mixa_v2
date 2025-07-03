'use client'

import { useState, useRef, ReactNode, useEffect } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { ChevronDown, ChevronsUp, ChevronsUpDown, ChevronUp } from 'lucide-react';
import AccordionWrapper from './AccordionWrapper';

interface OptionSelectorProps {
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  children?: ReactNode;
  portalExtra?: () => ReactNode; // Function that returns additional content for the portal
  accordionLabel?: string; // If provided, wrap options in accordion with this label
}

export default function OptionSelector({ 
  onChange, 
  options,
  placeholder,
  className,
  children,
  portalExtra,
  accordionLabel
}: OptionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(accordionLabel ? false : true); // Start closed if label provided
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
          {/* Conditional accordion button */}
          {accordionLabel && options.length > 0 && (
            <button 
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors text-left" 
              onClick={(e) => {
                e.stopPropagation();
                setAccordionOpen(!accordionOpen);
              }}
            >
              <div className="flex items-center gap-2">
                {accordionOpen ? <ChevronUp size={14} strokeWidth={1.5} className="text-zinc-600"/> : <ChevronDown size={14} strokeWidth={1.5} className="text-zinc-600"/>}
                <span className="text-xs text-zinc-800">{accordionLabel}</span>
              </div>
            </button>
          )}
          
          {/* Options wrapped in accordion */}
          <AccordionWrapper openStatus={accordionOpen}>
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
          </AccordionWrapper>

          {/* Separator between options and extra content */}
          {options.length > 0 && portalExtra && (
            <div className="border-t border-zinc-100 mt-1 mb-1 w-full" />
          )}

          {/* Extra content from portalExtra prop */}
          {portalExtra && (
            <div className="w-full">
              {portalExtra()}
            </div>
          )}
        </div>
      </Portal>
    </div>
  );
}
