"use client"

import MixCard from "./MixCard";
import { useDashboard } from "../../_contexts/DashboardContext";

const ProjectsGrid = ( {mixes} : {mixes : any} ) => {
  const { clearSelections } = useDashboard();
    return (
        <div
        onClick={() => clearSelections()}
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr", maxWidth: "1440px" }} 
        className="w-full grid gap-12">
          {mixes.map((mix : any, index : number) => (
            <div key={mix.id}
              style={{gridColumn: index === 0 ? "span 2": "span 1" }}>
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