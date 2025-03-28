"use client"

import MixCard from "./MixCard";
import { useDashboard } from "../../_contexts/DashboardContext";

const ProjectsGrid = ( {mixes} : {mixes : any} ) => {
  const { clearSelections } = useDashboard();
    return (
        <div
        onClick={() => clearSelections()}
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 transition-all duration-300 overflow-x-hidden">
          {mixes.map((mix : any, index : number) => (
            <div key={mix.id}>
                <MixCard 
                  id={mix.id} 
                  mName={mix.name || `Project ${mix.id}`}
                  updatedAt={mix.updatedAt} 
                />
            </div>
          ))}
      </div>
    );
  }

export default ProjectsGrid;