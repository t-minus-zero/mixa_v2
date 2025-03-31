"use client"

import React, { useState, useEffect, useRef, Children } from 'react';

interface RadioListProps {
  activeIndex?: number;
  active?: string;
  onActiveIndexChange?: (index: number, value?: string) => void;
  className?: string;
  children: React.ReactNode;
  values?: string[];
}

const RadioList: React.FC<RadioListProps> = ({ 
  activeIndex = 0, 
  active,
  onActiveIndexChange,
  className = "",
  children,
  values = []
}) => {
  const [selectedIndex, setSelectedIndex] = useState(activeIndex);
  const [position, setPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  // Keep in sync with external state
  useEffect(() => {
    if (active && values.includes(active)) {
      const index = values.indexOf(active);
      setSelectedIndex(index);
    } else if (activeIndex !== selectedIndex) {
      setSelectedIndex(activeIndex);
    }
  }, [active, activeIndex, selectedIndex, values]);

  // Update background position and width when selection changes
  useEffect(() => {
    if (buttonsRef.current) {
      const items = buttonsRef.current.querySelectorAll('.radio-item');
      if (items.length > 0 && items[selectedIndex]) {
        const selectedItem = items[selectedIndex] as HTMLElement;
        setPosition(selectedItem.offsetLeft);
        setWidth(selectedItem.offsetWidth);
      }
    }
  }, [selectedIndex, children]);

  // Handle item click
  const handleClick = (index: number) => {
    setSelectedIndex(index);
    if (onActiveIndexChange) {
      // Pass both index and corresponding value if available
      const value = values && index < values.length ? values[index] : undefined;
      onActiveIndexChange(index, value);
    }
  };

  return (
    <div className={`relative flex bg-zinc-100 rounded-full p-1 ${className}`}>
      <div className="relative flex">
        {/* Sliding background */}
        <div className="absolute w-full h-full">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
            style={{ transform: `translateX(${position}px)`, width: `${width}px` }}
          />
        </div>
        
        {/* Items container */}
        <div className="flex flex-row items-center justify-center rounded-full z-10" ref={buttonsRef}>
          {Children.map(children, (child, index) => {
            const isActive = active ? values[index] === active : selectedIndex === index;
            return (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`radio-item flex items-center justify-center transition-colors duration-300 ease-in-out cursor-pointer ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RadioList;
