"use client"

import React from 'react';
import { DashboardProvider } from '../_contexts/DashboardContext';
import DashboardLayout from '../_layouts/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardProvider>
  );
}
