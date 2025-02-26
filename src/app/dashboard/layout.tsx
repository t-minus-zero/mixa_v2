"use client"

import React from 'react';
import { DashboardDataProvider  } from '../_contexts/DashboardContext';
import DashboardLayout from '../_layouts/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardDataProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardDataProvider>
  );
}
