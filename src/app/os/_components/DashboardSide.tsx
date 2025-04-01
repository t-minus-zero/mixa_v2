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
        className="relative h-full overflow-auto bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out flex-shrink-0"
        style={{ 
          width: isOpen ? `${100 - mainColumnWidth}%` : '0',
          opacity: isOpen ? 1 : 0,
          transition: isDragging ? 'none' : 'all 300ms ease-in-out'
        }}
      >
        <div className="p-4">
          {content || (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold">Side Panel</h2>
              <p>This side panel will show additional content.</p>
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <p>Controls and UI will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Draggable divider (only visible when side panel is active) */}
      {isOpen && (
        <div 
          className="absolute flex items-center justify-center h-full cursor-col-resize bg-transparent group z-50"
          style={{ 
            left: `calc(${100 - mainColumnWidth}% - 4px)`,
            marginLeft: isSidebarOpen ? '2.5rem' : '0', // Add sidebar width (w-10 = 2.5rem) when open
            width: '8px',
            transition: isDragging ? 'none' : 'all 300ms ease-in-out' 
          }}
          onMouseDown={onDragStart}     
        >
          <div className="h-full group-hover:bg-gray-200 w-[2px] rounded-lg"></div>
        </div>
      )}

    </>
  );
}
