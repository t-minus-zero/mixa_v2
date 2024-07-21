"use client"

import React from 'react';

export default function ModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-48 h-48 flex items-center justify-center flex-col rounded-xl bg-zinc-300">
        {children}
    </div>
  );
}
