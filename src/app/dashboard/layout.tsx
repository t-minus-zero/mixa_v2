"use client"

import React from 'react';
import { DashboardDataProvider  } from '../context/DashboardContext';
import DashboardLayout from '../layouts/DashboardLayout';

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardDataProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardDataProvider>
  );
}
