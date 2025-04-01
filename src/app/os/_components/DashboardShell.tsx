"use client";

import React, { useState, useRef, useEffect } from 'react';
import DashboardMain from './DashboardMain';
import DashboardSide from './DashboardSide';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardShell({ 
  mainContent,
  sideContent
}: { 
  mainContent?: React.ReactNode,
  sideContent?: React.ReactNode
}) {
  // State to track if sidebar is open/hovered
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State to track if side panel is open
  const [isSideOpen, setIsSideOpen] = useState(false);
  
  // Default side panel takes up 30% of width when open
  const [mainColumnWidth, setMainColumnWidth] = useState(70);
  
  // Refs for handling dragging
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  // Toggle side panel open/closed
  const toggleSide = () => {
    setIsSideOpen(prev => !prev);
  };
  
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
    const availableWidth = containerRect.width;
    const offsetX = e.clientX - containerRect.left;
    
    // Calculate new width as percentage (clamped between 15% and 70%)
    const newWidthPercentage = Math.min(
      Math.max(100 - ((offsetX / availableWidth) * 100), 30), 
      85
    );
    
    setMainColumnWidth(newWidthPercentage);
  };

  // Handle end dragging
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    document.body.style.cursor = "default";
    
    // Restore transitions after dragging ends
    if (containerRef.current) {
      containerRef.current.style.transition = 'all 300ms ease-in-out';
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
      className="relative flex w-full h-full overflow-hidden bg-gray-50"
    >
      {/* Fixed sidebar - toggles on hover */}
      <DashboardSidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      {/* Collapsible side panel */}
      <DashboardSide 
        content={sideContent}
        isOpen={isSideOpen}
        mainColumnWidth={mainColumnWidth}
        isDragging={isDraggingRef.current}
        onDragStart={handleDragStart}
        isSidebarOpen={isSidebarOpen}
      />
      
      {/* Main content area */}
      <DashboardMain 
        content={mainContent}
        isSideOpen={isSideOpen}
        mainColumnWidth={mainColumnWidth}
        isDragging={isDraggingRef.current}
        onToggleSide={toggleSide}
      />
    </div>
  );
}
