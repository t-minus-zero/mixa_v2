"use client"

import React from 'react';
import { MixProvider } from '../../context/MixContext';
import MixLayout from '../../layouts/MixLayout';

export default function MixRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MixProvider>
      <MixLayout>
        {children}
      </MixLayout>
    </MixProvider>
  );
}
