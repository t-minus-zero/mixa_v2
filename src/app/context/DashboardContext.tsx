"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  // Add other project fields as needed
}

interface DashboardContextProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch projects and update state
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => setProjects(data));
  }, []);

  return (
    <DashboardContext.Provider value={{ projects, setProjects }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};