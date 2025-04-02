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
      className={`relative h-full overflow-auto bg-white flex-grow transition-all duration-300 ease-in-out`}
      style={{ 
        width: isSideOpen ? `${mainColumnWidth}%` : '100%',
        transition: isDragging ? 'none' : 'all 300ms ease-in-out'
      }}
    >
      <div className="p-6">
        {content || (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">/</h1>

          </div>
        )}
      </div>
    </div>
  );
}
