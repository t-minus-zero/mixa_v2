"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface MixProject {
  id: string;
  name: string;
  // Add other project fields as needed
}

interface MixContextProps {
  project: MixProject | null;
  setProject: (project: MixProject) => void;
}

const MixContext = createContext<MixContextProps | undefined>(undefined);

export const MixProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProject] = useState<MixProject | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Fetch the mix project by id and update state
      fetch(`/api/projects/${id}`)
        .then(response => response.json())
        .then(data => setProject(data));
    }
  }, [id]);

  return (
    <MixContext.Provider value={{ project, setProject }}>
      {children}
    </MixContext.Provider>
  );
};

export const useMixContext = () => {
  const context = useContext(MixContext);
  if (!context) {
    throw new Error('useMixContext must be used within a MixProvider');
  }
  return context;
};
