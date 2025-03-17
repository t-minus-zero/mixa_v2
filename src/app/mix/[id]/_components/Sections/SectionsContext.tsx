"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of our context state
interface SectionsState {
  structure: boolean;
  data: boolean;
  aichat: boolean;
}

// Define the shape of our context
interface SectionsContextType {
  sections: SectionsState;
  toggleSection: (section: keyof SectionsState) => void;
  openSection: (section: keyof SectionsState) => void;
  closeSection: (section: keyof SectionsState) => void;
}

// Create the context with a default value
const SectionsContext = createContext<SectionsContextType | undefined>(undefined);

// Provider component
export function SectionsProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<SectionsState>({
    structure: false,
    data: false,
    aichat: false,
  });

  // Toggle a specific section's open/closed state
  const toggleSection = (section: keyof SectionsState) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Open a specific section
  const openSection = (section: keyof SectionsState) => {
    setSections((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  // Close a specific section
  const closeSection = (section: keyof SectionsState) => {
    setSections((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const value = {
    sections,
    toggleSection,
    openSection,
    closeSection,
  };

  return (
    <SectionsContext.Provider value={value}>
      {children}
    </SectionsContext.Provider>
  );
}

// Custom hook to use the context
export function useSections() {
  const context = useContext(SectionsContext);
  if (context === undefined) {
    throw new Error("useSections must be used within a SectionsProvider");
  }
  return context;
}
