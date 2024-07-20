import React from 'react';
import { DashboardProvider } from '../context/DashboardContext';
import DashboardLayout from '../layouts/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardProvider>
  );
}
