import ProjectsGrid from './_components/ProjectsGrid';
import { getAllMixes } from '../_contexts/DataContext';

export const dynamic = "force-dynamic";

export default async function DashboardPage({ children }: { children: React.ReactNode }) {
  // Use the server-side data utility to fetch mixes
  const mixes = await getAllMixes();
  
  return (
    <div className="w-screen flex items-center flex-col overflow-hidden">
      <div className="w-full flex items-center flex-col px-4">
        {children}
        <ProjectsGrid mixes={mixes} />
      </div>
    </div>
  );
}
