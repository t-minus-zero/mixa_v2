"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Mix } from './DataContext';

// Dashboard context - purely client-side UI state
interface DashboardContextProps {
  // Selection state
  selectedMixIds: number[];
  toggleMixSelection: (id: number, isMultiSelectMode: boolean) => void;
  clearSelections: () => void;
  isMixSelected: (id: number) => boolean;
  
  // UI state for mixes
  mixes: Mix[];
  setMixes: (mixes: Mix[]) => void;

  // Left panel state
  leftPanelState: 'open' | 'closed';
  toggleLeftPanel: () => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children, initialMixes = [] }: { children: ReactNode, initialMixes?: Mix[] }) => {
  // Selection state
  const [selectedMixIds, setSelectedMixIds] = useState<number[]>([]);
  // Mix data state (received from server but managed in client context)
  const [mixes, setMixes] = useState<Mix[]>(initialMixes);
  // Left panel state
  const [leftPanelState, setLeftPanelState] = useState<'open' | 'closed'>('closed');

  // Selection handling functions
  const toggleMixSelection = (id: number, isMultiSelectMode: boolean) => {
    if (isMultiSelectMode) {
      // Toggle the selection while keeping others
      setSelectedMixIds(prev => 
        prev.includes(id) 
          ? prev.filter(mixId => mixId !== id) 
          : [...prev, id]
      );
    } else {
      // Replace selection with just this item
      setSelectedMixIds([id]);
    }
  };

  const clearSelections = () => setSelectedMixIds([]);
  
  const isMixSelected = (id: number) => selectedMixIds.includes(id);

  // Toggle left panel state
  const toggleLeftPanel = () => {
    setLeftPanelState(prev => prev === 'open' ? 'closed' : 'open');
  };

  return (
    <DashboardContext.Provider value={{ 
      // Selection state
      selectedMixIds,
      toggleMixSelection,
      clearSelections,
      isMixSelected,
      
      // Mix data state
      mixes,
      setMixes,

      // Left panel state
      leftPanelState,
      toggleLeftPanel
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
