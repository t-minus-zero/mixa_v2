"use client";

import React, { useState, useRef, useEffect } from 'react';
import DashboardMain from './DashboardMain';
import DashboardSide from './DashboardSide';
import DashboardSidebar from './DashboardSidebar';
import KitChat from '../../kit/_components/KitChat';
import { useDashboardContext } from '../_contexts/DashboardContext';

export default function DashboardShell({ 
  mainContent,
  sideContent
}: { 
  mainContent?: React.ReactNode,
  sideContent?: React.ReactNode
}) {
  const { 
    sideContentType, setSideContentType,
    isSideOpen, setSideOpen 
  } = useDashboardContext();
  
  // State to track if sidebar is open/hovered
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State to track if sidebar should remain open
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  
  // Default side panel takes up 30% of width when open
  const [mainColumnWidth, setMainColumnWidth] = useState(70);
  
  // Refs for handling dragging
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
  // Toggle side panel open/closed
  const toggleSide = () => {
    setSideOpen(!isSideOpen);
  };
  
  // Detect when sideContent is provided
  React.useEffect(() => {
    // If sideContent exists but we don't have a specific type set, mark it as 'custom'
    if (!!sideContent && !sideContentType) {
      setSideContentType('custom');
    } else if (!sideContent && sideContentType === 'custom') {
      // If sideContent is removed and type was 'custom', clear the type
      setSideContentType(null);
    }
  }, [sideContent, sideContentType, setSideContentType]);
  
  // Refs for initial positions
  const initialMouseX = useRef<number>(0);
  const initialMainWidth = useRef<number>(0);

  // Handle start dragging
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    
    // Store initial positions for more accurate dragging
    initialMouseX.current = e.clientX;
    initialMainWidth.current = mainColumnWidth;
    
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
    // Account for sidebar width when calculating available width
    const sidebarWidth = isSidebarOpen ? 48 : 0; // 3rem = 48px
    const availableWidth = containerRect.width - sidebarWidth;
    
    // Calculate the delta (change) from the starting position
    const deltaX = e.clientX - initialMouseX.current;
    const deltaPercentage = (deltaX / availableWidth) * 100;
    
    // Apply the delta to the initial width (moving right decreases main width)
    const newWidthPercentage = Math.min(
      Math.max(initialMainWidth.current - deltaPercentage, 30), 
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
        isLocked={isSidebarLocked}
        setIsLocked={setIsSidebarLocked}
      />
      
      {/* Collapsible side panel */}
      <DashboardSide 
        content={sideContentType === 'kit' ? <KitChat /> : sideContent}
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
