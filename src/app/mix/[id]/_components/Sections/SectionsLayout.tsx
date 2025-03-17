"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSections } from "./SectionsContext";

interface SectionsLayoutProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function SectionsLayout({ 
  leftContent, 
  rightContent
}: SectionsLayoutProps) {
  const { sections } = useSections();
  
  // Default left column is 1/3 of the width (as a percentage)
  const [leftColumnWidth, setLeftColumnWidth] = useState(33);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  // Calculate effective column widths based on sections visibility
  const effectiveLeftWidth = sections.aichat ? leftColumnWidth : 0;
  const effectiveRightWidth = sections.aichat ? (100 - leftColumnWidth) : 100;

  // Handle start dragging
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    
    // Remove transitions during dragging for better performance
    if (containerRef.current) {
      containerRef.current.style.transition = 'none';
    }
    
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  // Handle dragging
  const handleDrag = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const offsetX = e.clientX - containerRect.left;
    
    // Calculate new width as percentage (clamped between 20% and 80%)
    const newWidthPercentage = Math.min(
      Math.max((offsetX / containerWidth) * 100, 20), 
      80
    );
    
    setLeftColumnWidth(newWidthPercentage);
  };

  // Handle end dragging
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = "default";
    
    // Restore transitions after dragging ends
    if (containerRef.current) {
      containerRef.current.style.transition = 'grid-template-columns 300ms ease-in-out';
    }
    
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-zinc-100"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `${effectiveLeftWidth}% ${effectiveRightWidth}%`,
        transition: isDraggingRef.current ? 'none' : 'grid-template-columns 300ms ease-in-out'
      }}
    >
      {/* Left column (AI Chat) */}
      <div 
        className="relative h-full overflow-hidden transition-all pl-2 duration-300 ease-in-out"
        style={{
          opacity: sections.aichat ? 1 : 0,
          maxWidth: sections.aichat ? '100%' : '0',
          transition: isDraggingRef.current ? 'none' : 'all 300ms ease-in-out'
        }}
      >
        {leftContent || <div>Left Column Content</div>}
      </div>
      
      {/* Right column (Work View) */}
      <div id="rightcontent"
        className={`relative h-full overflow-hidden transition-all ${sections.aichat ? 'p-2' : 'p-0'}`}
        style={{
          transition: isDraggingRef.current ? 'none' : 'all 300ms ease-in-out'
        }}
      >
        <div 
          id="rightcontentwrapper" 
          className={`relative w-full h-full overflow-hidden shadow-sm bg-zinc-100 flex items-center justify-center border-zinc-200 ${sections.aichat ? 'rounded-xl border' : ''}`}
        >
          {rightContent || <div>Right Column Content</div>}
        </div>  
      </div>
      
      {/* Draggable divider (only visible when aichat is active) */}
      {sections.aichat && (
        <div 
          className="absolute flex items-center justify-center h-full cursor-col-resize bg-transparent hover:opacity-50 z-50"
          style={{ 
            left: `${leftColumnWidth}%`,
            width: '6px'
          }}
          onMouseDown={handleDragStart}     
        >
          <div className="bg-zinc-300 h-12 w-1 rounded-lg"></div>
        </div>
      )}
    </div>
  );
}
