import ProjectsGrid from './_components/ProjectsGrid';
import {db} from '../../server/db';

export const dynamic = "force-dynamic";

export default async function DashboardPage({ children }: { children: React.ReactNode }) {

  const mixes = await db.query.mixes.findMany({
    orderBy: (model, {desc}) => desc(model.id),
  });
  
  return (
    <div className="w-screen flex items-center flex-col overflow-hidden">
      <div className="w-full flex items-center flex-col px-4">
        {children}
        <ProjectsGrid mixes={mixes} />
      </div>
    </div>
  );
}
