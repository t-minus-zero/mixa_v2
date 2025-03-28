"use client"

import { useDashboard } from '../../_contexts/DashboardContext';

export default function ExplorePage() {
  // Access dashboard context if needed
  const { leftPanelState } = useDashboard();
  
  return (
    <div className="w-full flex items-center flex-col overflow-hidden">
      <div className="w-full max-w-full p-6">
        <h2 className="text-2xl font-bold text-zinc-800 mb-6">Explore</h2>
        <p className="text-zinc-600">
          Discover new templates, sounds, and inspiration for your next project.
        </p>
        
        {/* Placeholder for explore content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div 
              key={item} 
              className="aspect-[1/1] bg-zinc-100 rounded-xl flex items-center justify-center"
            >
              <span className="text-zinc-400">Explore Item {item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
