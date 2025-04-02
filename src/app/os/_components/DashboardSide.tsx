"use client";

import React from 'react';

export interface DashboardSideProps {
  content?: React.ReactNode;
  isOpen: boolean;
  mainColumnWidth: number;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  isSidebarOpen?: boolean; // To account for sidebar state
}

export default function DashboardSide({ 
  content, 
  isOpen, 
  mainColumnWidth, 
  isDragging,
  onDragStart,
  isSidebarOpen = false
}: DashboardSideProps) {
  return (
    <>
      {/* Left Side Panel */}
      <div 
        className="relative h-full overflow-auto bg-gray-50 transition-all duration-300 ease-in-out flex-shrink-0"
        style={{ 
          width: isOpen ? `${100 - mainColumnWidth}%` : '0',
          opacity: isOpen ? 1 : 0,
          transition: isDragging ? 'none' : 'all 300ms ease-in-out'
        }}
      >
        <div className="h-full w-full">
          {content}
        </div>
      </div>
      
      {/* Draggable divider (only visible when side panel is active) */}
      {isOpen && (
        <div 
          className="absolute flex items-center justify-center h-full cursor-col-resize bg-transparent group z-50"
          style={{ 
            left: `calc(${100 - mainColumnWidth}% - 4px)`,
            marginLeft: isSidebarOpen ? '3rem' : '0', // Add sidebar width (w-12 = 3rem) when open
            width: '8px',
            transition: isDragging ? 'none' : 'all 300ms ease-in-out' 
          }}
          onMouseDown={onDragStart}     
        >
          <div className="h-full w-[2px] rounded-lg overflow-hidden">
            <div className="h-full w-full group-hover:opacity-100 opacity-0 transition-opacity duration-200" 
                 style={{ 
                   background: 'linear-gradient(to bottom, transparent, #e5e7eb 50%, transparent)'
                 }}
            ></div>
          </div>
        </div>
      )}

    </>
  );
}
