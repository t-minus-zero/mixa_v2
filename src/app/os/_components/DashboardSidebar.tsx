"use client";

import React, { useState, useRef } from 'react';

export interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full flex-shrink-0">
      {/* Invisible trigger area - always present at the edge of the screen */}
      <div 
        className="absolute top-0 left-0 w-2 h-full z-10"
        onMouseEnter={() => setIsOpen(true)}
      />
      
      {/* Actual sidebar content */}
      <div 
        ref={sidebarRef}
        className="h-full bg-zinc-50 border-r border-zinc-200 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: isOpen ? '2.5rem' : '0' }} // w-10 = 2.5rem
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Sidebar content will go here later */}
      </div>
    </div>
  );
}
