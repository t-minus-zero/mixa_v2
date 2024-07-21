import MixCard from "./MixCard";

const ProjectsGrid = ( {mixes} : {mixes : any} ) => {
    return (
        <div
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr", maxWidth: "1440px" }} 
        className="w-full grid gap-12">
          {mixes.map((mix : any, index : number) => (
            <div key={mix.id}
              style={{gridColumn: index === 0 ? "span 2": "span 1" }}>
                <MixCard id={mix.id} mName={mix.id}/>
            </div>
          ))}
      </div>
    );
  }

export default ProjectsGrid;