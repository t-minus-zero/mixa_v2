'use client';

import React from 'react';
import AiChat from './_components/AiChat';

export default function KITPage() {
  return (
    <div className="w-full h-screen bg-zinc-50 flex flex-col">
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="max-w-4xl mx-auto h-full rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <AiChat />
        </div>
      </div>
    </div>
  );
}
