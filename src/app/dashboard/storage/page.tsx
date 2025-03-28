"use client"

import { useDashboard } from '../../_contexts/DashboardContext';

export default function StoragePage() {
  // Access dashboard context if needed
  const { leftPanelState, mixes } = useDashboard();
  
  // Calculate estimated storage based on number of mixes
  const storagePercentage = Math.min(mixes.length * 2.4, 100);
  
  return (
    <div className="w-full flex items-center flex-col overflow-hidden">
      <div className="w-full max-w-full p-6">
        <h2 className="text-2xl font-bold text-zinc-800 mb-6">Storage</h2>
        <p className="text-zinc-600">
          Manage your files, recordings, and media assets.
        </p>
        
        {/* Storage usage chart placeholder */}
        <div className="w-full bg-zinc-100 rounded-xl p-6 mt-8">
          <div className="flex justify-between mb-4">
            <span className="text-zinc-800 font-medium">Storage Used</span>
            <span className="text-zinc-800 font-medium">{storagePercentage.toFixed(1)}% of 10GB</span>
          </div>
          <div className="w-full bg-zinc-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${storagePercentage}%` }}></div>
          </div>
        </div>
        
        {/* File list placeholder */}
        <div className="mt-8 border border-zinc-200 rounded-xl overflow-hidden">
          <div className="bg-zinc-50 p-4 border-b border-zinc-200 flex justify-between">
            <span className="font-medium text-zinc-800">Filename</span>
            <div className="flex gap-12">
              <span className="font-medium text-zinc-800">Size</span>
              <span className="font-medium text-zinc-800">Date</span>
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-4 border-b border-zinc-100 flex justify-between items-center hover:bg-zinc-50">
              <span className="text-zinc-700">File_{item}.wav</span>
              <div className="flex gap-12">
                <span className="text-zinc-500 w-20 text-right">{(item * 4.2).toFixed(1)} MB</span>
                <span className="text-zinc-500 w-32 text-right">March {10 + item}, 2025</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
