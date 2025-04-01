'use client';

import React from 'react';

export default function KITLoading() {
  return (
    <div className="w-full h-screen bg-zinc-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="text-zinc-600 animate-pulse">Loading Knowledge Interface Terminal...</p>
      </div>
    </div>
  );
}
