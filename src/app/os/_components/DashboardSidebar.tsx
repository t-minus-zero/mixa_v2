"use client";

import React, { useRef } from 'react';
import Dock from './dock/Dock';
import { useDashboardContext } from '../_contexts/DashboardContext';

export interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLocked?: boolean;
  setIsLocked?: (isLocked: boolean) => void;
}

export default function DashboardSidebar({ 
  isOpen, 
  setIsOpen,
  isLocked = false,
  setIsLocked = () => {}
}: DashboardSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { activeSection, setActiveSection } = useDashboardContext();

  return (
    <div className="relative h-full flex-shrink-0">
      {/* Invisible trigger area - always present at the edge of the screen */}
      <div 
        className="absolute top-0 left-0 w-2 h-full z-10"
        onMouseEnter={() => !isLocked && setIsOpen(true)}
      />
      
      {/* Actual sidebar content */}
      <div 
        ref={sidebarRef}
        className="h-full bg-zinc-50 border-r border-zinc-200 overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center"
        style={{ width: (isOpen || isLocked) ? '3rem' : '0' }} // w-12 = 3rem
        onMouseLeave={() => !isLocked && setIsOpen(false)}
      >
        {/* Dock navigation */}
        <Dock 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isLocked={isLocked}
          onToggleLock={() => setIsLocked(!isLocked)}
        />
      </div>
    </div>
  );
}
