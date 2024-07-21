"use client"

import React from 'react';
import { TreeProvider } from './_components/TreeContext';

export default function MixLayout({ children }: { children: React.ReactNode }) {
  return (
    <TreeProvider>
      {children}
    </TreeProvider>
  );
}
