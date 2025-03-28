"use client"

import ProjectsGrid from '../_components/ProjectsGrid';
import { getAllMixes } from '../../_contexts/DataContext';

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // Use the server-side data utility to fetch mixes
  const mixes = await getAllMixes();
  
  return (
    <div className="w-full flex items-center flex-col overflow-hidden">
      <div className="w-full max-w-full flex items-center flex-col">
        <ProjectsGrid mixes={mixes} />
      </div>
    </div>
  );
}
