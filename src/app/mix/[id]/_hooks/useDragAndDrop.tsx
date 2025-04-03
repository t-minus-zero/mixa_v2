'use client';

import { useRef } from 'react';

/**
 * A custom hook that provides a connector for drag and drop operations.
 * Components must provide their own handler implementations.
 * 
 * @param handlers Object containing handler functions for drag events
 * @returns Object containing state and event connectors for drag and drop
 */
export function useDragAndDrop(handlers: {
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}) {
  
  // Local component state for position
  const elementRef = useRef(null);

  // Pure connector functions - just prevents default and delegates to handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    
    if (handlers.onDragStart) {
      handlers.onDragStart(e);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (handlers.onDragOver) {
      handlers.onDragOver(e);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (handlers.onDragLeave) {
      handlers.onDragLeave(e);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (handlers.onDrop) {
      handlers.onDrop(e);
    }
  };

  return {
    // Refs
    elementRef,
    
    // Event handlers
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}

export default useDragAndDrop;
