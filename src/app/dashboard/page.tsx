
import DashboardFilters from './_components/DashboardFilters';
import ProjectsGrid from './_components/ProjectsGrid';
import {db} from '../../server/db';

export const dynamic = "force-dynamic";



export default async function DashboardPage({ children }: { children: React.ReactNode }) {

  const posts = await db.query.posts.findMany();
  
  return (
    <div className="w-screen flex items-center flex-col overflow-hidden">
      <div className="w-full flex items-center flex-col px-4">
        <DashboardFilters />
        <ProjectsGrid posts={posts} />
      </div>
    </div>
  );
}
