import MixCard from "./MixCard";
import Link from "next/link";

const ProjectsGrid = ( {posts} : {posts : any} ) => {
    return (
        <div
        style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr", maxWidth: "1440px" }} 
        className="w-full grid gap-12">
          {posts.map((post : any, index : number) => (
            <div key={post.id}
              style={{gridColumn: index === 0 ? "span 2": "span 1" }}>
              <Link href={`/mix/${post.id}`} >{post.title}</Link>
              <MixCard id={post.id} mName={post.title}/>
            </div>
          ))}
      </div>
    );
  }

export default ProjectsGrid;