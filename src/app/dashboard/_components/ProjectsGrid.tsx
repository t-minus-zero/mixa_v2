
import MixCard from "./MixCard";

const ProjectsGrid = ( {posts} ) => {
    return (
        <div
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr", maxWidth: "1440px" }} 
        className="w-full grid gap-12">
          {posts.map((post, index) => (
            <div style={{gridColumn: index === 0 ? "span 2": "span 1" }}>
              <MixCard key={index} id={post.id} mName={post.title}/>
            </div>
          ))}
      </div>
    );
  }

export default ProjectsGrid;