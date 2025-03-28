"use client"

import ProjectsGrid from '../_components/ProjectsGrid';
import { useDashboard } from '../../_contexts/DashboardContext';

export default function LibraryPage() {
  // Get mixes from the dashboard context
  const { mixes } = useDashboard();
  
  return (
    <div className="w-full flex items-center flex-col overflow-hidden">
      <div className="w-full max-w-full flex items-center flex-col">
        <ProjectsGrid mixes={mixes} />
      </div>
    </div>
  );
}
  