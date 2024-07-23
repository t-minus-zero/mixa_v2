"use client"

import React, {useState, useEffect} from 'react';

export default function AccordionWrapper({ children, openStatus }: { children: React.ReactNode, openStatus: boolean }) {
    const [isOpen, setIsOpen] = useState(openStatus);

    useEffect(() => {
        setIsOpen(openStatus);
    }, [openStatus]);

  return (
    <div
        style={{
            display : 'grid', 
            gridTemplateRows: isOpen ? '1fr' : '0fr', 
            transition: 'grid-template-rows 500ms',
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