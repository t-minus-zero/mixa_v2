"use client"

import ProjectsGrid from '../_components/ProjectsGrid';
import { useDashboard } from '../../_contexts/DashboardContext';
import TitleMenu from '../_components/TitleMenu';
import MenuList from '../_components/MenuList';
import RadioList from '../_components/RadioList';
import { useState } from 'react';
import { Grid2X2, Rows3 } from 'lucide-react';

export default function LibraryPage() {
  // Get mixes from the dashboard context
  const { mixes } = useDashboard();
  
  // Local state for the library page
  const [viewMode, setViewMode] = useState('Cards');
  const [sortOption, setSortOption] = useState('Last Modified');
  
  // Handle view mode changes
  const handleViewModeChange = (index: number, value?: string) => {
    // Use the value directly if provided, otherwise fall back to index-based logic
    if (value) {
      setViewMode(value);
    } else {
      setViewMode(index === 0 ? 'Cards' : 'List');
    }
  };
  

  // Define the controls component to be passed to TitleMenu
  const LibraryControls = (
    <div className="flex flex-row gap-2 pl-4 rounded-full">
      <div className=" flex items-center justify-center px-4 bg-zinc-50 rounded-full">
        <MenuList 
          list={[
            {name: "Last Modified", url: "dashboard/"}, 
            {name: "Deleted", url: "dashboard"}
          ]} 
        />
      </div>
      {/* RadioList with icon options and string values */}
      <RadioList 
        active = {viewMode}
        values={['Cards', 'List']}
      >
        <button className="p-2 text-sm" onClick={() => setViewMode('Cards')}><Grid2X2 size={18} /></button>
        <button className="p-2 text-sm" onClick={() => setViewMode('List')}><Rows3 size={18} /></button>
      </RadioList>
    </div>
  );
  
  return (
    <div className="w-full flex items-center flex-col overflow-hidden">
      
      <div className="w-full relative overflow-y-auto h-full max-h-screen max-w-full flex items-center flex-col">
        <div className="w-full sticky top-2 left-0 px-6 mb-6 z-20">
          <TitleMenu 
            title="Library" 
            controls={LibraryControls} 
          />
        </div>
        <ProjectsGrid mixes={mixes} />
      </div>
    </div>
  );
}
  