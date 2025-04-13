"use client"

import React, {useState, useEffect} from 'react';

interface AccordionProps {
  children: React.ReactNode;
  openStatus: boolean;
  fading?: boolean;
}

export default function AccordionWrapper({ children, openStatus, fading=false }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(openStatus);

    useEffect(() => {
        setIsOpen(openStatus);
    }, [openStatus]);

  return (
    <div
        style={{
            display : 'grid', 
            gridTemplateRows: isOpen ? '1fr' : '0fr', 
            transition: 'grid-template-rows 200ms',
            width: '100%',
            }}>
        <div 
          style={{
              opacity: isOpen ? '100%' : '0%',
              transition: 'opacity 300ms',
            }}
          className="overflow-hidden">
          {children}
        </div>
    </div>
  );
}

// Horizontal version of the accordion wrapper
export function AccordionWrapperH({ children, openStatus, fading=false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(openStatus);

  useEffect(() => {
    setIsOpen(openStatus);
  }, [openStatus]);

  return (
    <div
      style={{
        display: 'grid', 
        gridTemplateColumns: isOpen ? '1fr' : '0fr', 
        transition: 'grid-template-columns 200ms',
        height: '100%',
      }}
    >
      <div 
        style={{
          opacity: isOpen ? '100%' : '0%',
          transition: 'opacity 300ms',
        }}
        className="overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}