import React from 'react';
import { DashboardProvider } from './_contexts/DashboardContext';
import { ContextRegistryProvider } from './_contexts/ContextRegistry';

export default function OSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrap with both providers - DashboardContext for UI state
    // and ContextRegistry for managing child component contexts
    <DashboardProvider>
      <ContextRegistryProvider>
        <div className="w-screen h-screen">
          {/* Dashboard structure will go here */}
          <main className="w-full h-full">
            {children}
          </main>
        </div>
      </ContextRegistryProvider>
    </DashboardProvider>
  );
}
