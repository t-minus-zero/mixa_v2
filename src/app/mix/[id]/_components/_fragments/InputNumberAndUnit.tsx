'use client'

import React, { useState, useRef } from 'react';
import Popover from './Popover';

interface InputNumberAndUnitProps {
  id: string;
  value: number;
  unit: string;
  units?: string[];
  onValueChange: (value: number) => void;
  onUnitChange: (unit: string) => void;
  label?: string;
  className?: string;
}

export default function InputNumberAndUnit({
  id,
  value = 0,
  unit = "px",
  units = ["px", "%", "rem", "em", "vh", "vw"],
  onValueChange,
  onUnitChange,
  label,
  className = ""
}: InputNumberAndUnitProps) {
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartValue(value);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const diff = (dragStartY - e.clientY);
      const sensitivity = 1;
      const newValue = dragStartValue + Math.round(diff * sensitivity);
      onValueChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onValueChange(newValue);
    }
  };

  const dragHandleClasses = `
    flex items-center justify-center w-6 h-full 
    cursor-ns-resize border-r border-zinc-200
    ${isDragging ? 'bg-zinc-200' : 'hover:bg-zinc-200'}
  `;

  return (
    <div className="group relative flex items-center h-7 min-w-[100px] bg-zinc-100 rounded-md">
      <div
        className={dragHandleClasses}
        onMouseDown={handleDragStart}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-zinc-500">
          <path d="M8 9h8M8 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <input
        ref={inputRef}
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-full bg-transparent px-2 text-sm focus:outline-none"
      />

      <Popover
        isOpen={isUnitMenuOpen}
        onClose={() => setIsUnitMenuOpen(false)}
        trigger={
          <button
            onClick={() => setIsUnitMenuOpen(!isUnitMenuOpen)}
            className="px-2 h-full border-l border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-200"
          >
            {unit}
          </button>
        }
        className="mt-1"
      >
        <div className="bg-white rounded-md shadow-lg border border-zinc-200 py-1 min-w-[80px]">
          {units.map((u) => (
            <button
              key={u}
              onClick={() => {
                onUnitChange(u);
                setIsUnitMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-1 text-sm hover:bg-zinc-100 ${
                u === unit ? 'bg-zinc-50' : ''
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </Popover>
    </div>
  );
} 