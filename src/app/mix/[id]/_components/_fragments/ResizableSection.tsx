'use client'

import React, { useState, useRef, useEffect, ReactNode, useId } from 'react';

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
  const uniqueId = useId().replace(/:/g, '-');
  
  // Custom styles for the resize handle with unique ID to avoid conflicts
  const customStyles = `
    #resizable-${uniqueId}:hover .resize-handle-indicator-${uniqueId},
    #resizable-${uniqueId}:hover .radial-gradient-${uniqueId} {
      opacity: 1;
    }

    .resize-handle-${uniqueId} {
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
    
    .resize-handle-indicator-${uniqueId} {
      ${direction === 'horizontal' ? 'width: 1px; height: 100%;' : 'height: 1px; width: 100%;'}
      opacity: 0;
      transition: opacity 0.2s ease;
      ${direction === 'horizontal' ? 
        'background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(120, 120, 120, 0.5), rgba(0, 0, 0, 0));' : 
        'background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(120, 120, 120, 0.5), rgba(0, 0, 0, 0));'
      }
    }
    
    .resize-handle-${uniqueId}.resizing .resize-handle-indicator-${uniqueId} {
      opacity: 1;
    }
    
    .gradient-container-${uniqueId} {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: visible; /* Changed from hidden to allow the gradient to extend outside if needed */
    }
    
    .radial-gradient-${uniqueId} {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    /* Create separate style rules for left and right gradients to avoid conditional CSS issues */
    ${handlePosition === 'left' ? `
    .radial-gradient-${uniqueId} {
      background: radial-gradient(circle at left center, rgba(160, 160, 160, 0.15) 0%, rgba(160, 160, 160, 0.03) 30%, rgba(160, 160, 160, 0) 60%);
    }
    ` : `
    .radial-gradient-${uniqueId} {
      background: radial-gradient(circle at right center, rgba(160, 160, 160, 0.15) 0%, rgba(160, 160, 160, 0.03) 30%, rgba(160, 160, 160, 0) 60%);
    }
    `}
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
        id={`resizable-${uniqueId}`}
        ref={containerRef}
        className={`relative h-full ${className}`}
        style={direction === 'horizontal' ? { width: `${width}px` } : { height: `${width}px` }}
      >
        <div className={`gradient-container-${uniqueId}`}>
          <div className={`radial-gradient-${uniqueId}`} />
          <div className="relative z-10 w-full h-full flex-grow">
            {children}
          </div>
        </div>
        
        <div 
          className={`resize-handle-${uniqueId} ${isResizing ? 'resizing' : ''}`} 
          onMouseDown={handleResizeMouseDown}
        >
          <div className={`resize-handle-indicator-${uniqueId}`} />
        </div>
      </div>
    </>
  );
};

export default ResizableSection;
