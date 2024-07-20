"use client"

const MixCard = () => {
    return (
      <a 
        style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr 1fr" }}
        className="w-full h-80 bg-zinc-50 rounded-xl cursor-pointer overflow-hidden group grid">
        <div className="p-8 flex flex-row justify-between items-start gap-4 group">
          <div className="flex flex-col items-start justify-center">
            <span className="text-md font-bold text-zinc-700">Component name</span>
            <p className="text-xs text-zinc-500">Edited 1 Day Ago</p>
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
              src="https://via.placeholder.com/150" 
              alt="Component image" />
          </div>
        </div>
      </a>
    );
  }

export default MixCard;