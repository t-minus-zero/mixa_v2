"use client";

import React from 'react';

export interface DashboardMainProps {
  content?: React.ReactNode;
  isSideOpen: boolean;
  mainColumnWidth: number;
  isDragging: boolean;
  onToggleSide: () => void;
}

export default function DashboardMain({ 
  content, 
  isSideOpen, 
  mainColumnWidth, 
  isDragging,
  onToggleSide 
}: DashboardMainProps) {
  return (
    <div 
      className="relative h-full overflow-auto bg-white flex-grow transition-all duration-300 ease-in-out"
      style={{ 
        width: isSideOpen ? `${mainColumnWidth}%` : '100%',
        transition: isDragging ? 'none' : 'all 300ms ease-in-out'
      }}
    >
      <div className="p-6">
        {content || (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Main Content Area</h1>
            <p>This is where page content will be loaded.</p>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p>Pages like Mix would load here when navigating the OS dashboard.</p>
            </div>
            
            <button 
              onClick={onToggleSide}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isSideOpen ? 'Close Left Panel' : 'Open Left Panel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
