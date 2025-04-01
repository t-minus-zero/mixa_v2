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
        <div className="os-layout">
          {/* Dashboard structure will go here */}
          <main className="os-main">
            {children}
          </main>
        </div>
      </ContextRegistryProvider>
    </DashboardProvider>
  );
}
