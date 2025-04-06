'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizableSectionProps {
  children: ReactNode;
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  onWidthChange?: (width: number) => void;
  direction?: 'horizontal' | 'vertical';
  handlePosition?: 'right' | 'left' | 'top' | 'bottom';
}

const ResizableSection: React.FC<ResizableSectionProps> = ({
  children,
  defaultWidth,
  minWidth = 128,
  maxWidth = 800,
  className = '',
  onWidthChange,
  direction = 'horizontal',
  handlePosition = 'right'
}) => {
  const [width, setWidth] = useState<number>(defaultWidth);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom styles for the resize handle
  const customStyles = `
    .resizable-section-container:hover .resize-handle-indicator {
      opacity: 1;
    }

    .resize-handle {
      position: absolute;
      ${handlePosition === 'right' ? 'right: -5px;' : ''}
      ${handlePosition === 'left' ? 'left: -5px;' : ''}
      ${handlePosition === 'top' ? 'top: -5px;' : ''}
      ${handlePosition === 'bottom' ? 'bottom: -5px;' : ''}
      ${direction === 'horizontal' ? 'width: 10px; height: 100%; top: 0; cursor: ew-resize;' : ''}
      ${direction === 'vertical' ? 'height: 10px; width: 100%; left: 0; cursor: ns-resize;' : ''}
      z-index: 50;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .resize-handle-indicator {
      ${direction === 'horizontal' ? 'width: 1px; height: 100%;' : 'height: 1px; width: 100%;'}
      opacity: 0;
      transition: opacity 0.2s ease;
      ${direction === 'horizontal' ? 
        'background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(120, 120, 120, 0.5), rgba(0, 0, 0, 0));' : 
        'background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(120, 120, 120, 0.5), rgba(0, 0, 0, 0));'
      }
    }
    
    .resize-handle.resizing .resize-handle-indicator {
      opacity: 1;
    }
  `;
  
  // Direct DOM manipulation for resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = containerRef.current?.offsetWidth || defaultWidth;
    const startHeight = containerRef.current?.offsetHeight || defaultWidth;
    
    setIsResizing(true);
    
    function onMouseMove(e: MouseEvent) {
      if (!containerRef.current) return;
      
      if (direction === 'horizontal') {
        let newWidth: number;
        
        if (handlePosition === 'right') {
          newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + (e.clientX - startX)));
        } else {
          newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth - (e.clientX - startX)));
        }
        
        containerRef.current.style.width = `${newWidth}px`;
      } else {
        let newHeight: number;
        
        if (handlePosition === 'bottom') {
          newHeight = Math.min(maxWidth, Math.max(minWidth, startHeight + (e.clientY - startY)));
        } else {
          newHeight = Math.min(maxWidth, Math.max(minWidth, startHeight - (e.clientY - startY)));
        }
        
        containerRef.current.style.height = `${newHeight}px`;
      }
    }
    
    function onMouseUp() {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      // Update state with final width for React
      if (containerRef.current) {
        const finalDimension = direction === 'horizontal' 
          ? containerRef.current.offsetWidth 
          : containerRef.current.offsetHeight;
        
        setWidth(finalDimension);
        onWidthChange?.(finalDimension);
      }
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  // Update width when defaultWidth prop changes
  useEffect(() => {
    setWidth(defaultWidth);
    if (containerRef.current) {
      if (direction === 'horizontal') {
        containerRef.current.style.width = `${defaultWidth}px`;
      } else {
        containerRef.current.style.height = `${defaultWidth}px`;
      }
    }
  }, [defaultWidth, direction]);
  
  return (
    <>
      <style>{customStyles}</style>
      <div 
        ref={containerRef}
        className={`relative h-full resizable-section-container ${className}`}
        style={direction === 'horizontal' ? { width: `${width}px` } : { height: `${width}px` }}
      >
        {children}
        
        <div 
          className={`resize-handle ${isResizing ? 'resizing' : ''}`} 
          onMouseDown={handleResizeMouseDown}
        >
          <div className="resize-handle-indicator" />
        </div>
      </div>
    </>
  );
};

export default ResizableSection;
