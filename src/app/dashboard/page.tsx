"use client"

import { useDashboard } from '../_contexts/DashboardContext';
import ProjectsGrid from './_components/ProjectsGrid';

export default function DashboardPage() {
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
