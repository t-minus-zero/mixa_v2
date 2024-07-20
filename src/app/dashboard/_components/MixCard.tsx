"use client"


const MixCard = ( { id, mName }: { id: number; mName: any } ) => {
    return (
      <a 
        style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr 1fr" }}
        className="w-full h-80 bg-zinc-50 rounded-xl cursor-pointer overflow-hidden group grid">
        <div className="p-8 flex flex-row justify-between items-start gap-4 group">
          <div className="flex flex-col items-start justify-center">
            <span className="text-md font-bold text-zinc-700">{mName}</span>
            <p className="text-xs text-zinc-500">Edited {id} Day Ago</p>
          </div>
          <div className="text-zinc-900 cursor-pointer leading-5">
            <button className="flex flex-row items-center justify-center rounded-full hover:bg-white border border-zinc-300 font-bold text-sm text-zinc-500 w-10 h-10 leading-5"> &#8942; </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-end -mb-24 group-hover:-mb-12 transition-all duration-300 ease-in-out">
          <div 
            className="w-5/6 h-full ">
            <img
              className="rounded-xl object-cover w-full h-full" 
              src="https://utfs.io/f/9ff23c88-bd7a-40ce-ab9d-6d25d73d8ccf-n9ys8r.jpg" 
              alt="Component image" />
          </div>
        </div>
      </a>
    );
  }

export default MixCard;