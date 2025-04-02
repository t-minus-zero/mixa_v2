"use client";

// Dashboard Context - manages dashboard state and functionality
// This context is separate from the ContextRegistry which manages child components

import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the types for dashboard state and functions
interface DashboardContextType {
  // Dashboard UI state
  isMenuOpen: boolean;
  activeSection: string | null;
  sideContentType: string | null;
  isSideOpen: boolean;
  
  // Dashboard methods
  toggleMenu: () => void;
  setActiveSection: (section: string | null) => void;
  setSideContentType: (type: string | null) => void;
  setSideOpen: (isOpen: boolean) => void;
  
  // Other dashboard-specific functionality
  // Add more dashboard features as needed
}

// Create the context with a default empty state
export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  // State for dashboard functionality
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sideContentType, setSideContentType] = useState<string | null>(null);
  const [isSideOpen, setSideOpen] = useState(false);

  // Toggle menu handler
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  
  // Effect to control side panel open state based on content type
  useEffect(() => {
    // If we have a side content type, open the side panel
    if (sideContentType) {
      setSideOpen(true);
    } else {
      // If there's no side content type, close the side panel
      setSideOpen(false);
    }
  }, [sideContentType]);
  
  return (
    <DashboardContext.Provider value={{
      isMenuOpen,
      activeSection,
      sideContentType,
      isSideOpen,
      toggleMenu,
      setActiveSection,
      setSideContentType,
      setSideOpen
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  // Hook implementation for accessing dashboard functionality
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
