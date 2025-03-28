import React from 'react';
import { getAllMixes } from '../_contexts/DataContext';
import { DashboardProvider } from '../_contexts/DashboardContext';
import DashboardLayout from '../_layouts/DashboardLayout';

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  // Fetch mixes from the server
  const initialMixes = await getAllMixes().catch(error => {
    console.error('Error fetching mixes:', error);
    return []; // Return empty array if there's an error
  });
  
  return (
    <DashboardProvider initialMixes={initialMixes}>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardProvider>
  );
}
