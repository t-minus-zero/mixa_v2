"use client";

import React from 'react';

export interface DockButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  tag?: string;
  onClick?: () => void;
}

export default function DockButton({ 
  children, 
  isActive = true,
  tag,
  onClick
}: DockButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={onClick}
        id={tag}
        className={`
          min-w-8 min-h-8 flex items-center justify-center transition-all duration-200
          ${isActive ? 'text-blue-500' : 'text-zinc-800 hover:bg-zinc-100'}
          rounded-md
        `}
      >
        {children}
      </button>
    </div>
  );
}
