"use client";

import { useSections } from "./SectionsContext";
import Image from "next/image";

export default function Floater() {
  const { sections, toggleSection } = useSections();

  return (
    <div className="flex justify-center">
      <div className="flex p-1 rounded-lg bg-zinc-50 gap-1">
        <button 
          className={`p-2 rounded-md flex items-center justify-center transition-colors ${
            sections.structure 
              ? 'bg-blue-500 text-white hover:bg-blue-400' 
              : 'hover:bg-zinc-200'
          }`}
          onClick={() => toggleSection("structure")}
        >
          <span className="text-xs">Structure</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center justify-center transition-colors ${
            sections.data 
              ? 'bg-blue-500 text-white hover:bg-blue-400' 
              : 'hover:bg-zinc-200'
          }`}
          onClick={() => toggleSection("data")}
        >
          <span className="text-xs">Data</span>
        </button>
        
        <button 
          className={`p-2 rounded-md flex items-center justify-center transition-colors ${
            sections.aichat 
              ? 'bg-blue-500 text-white hover:bg-blue-400' 
              : 'hover:bg-zinc-200'
          }`}
          onClick={() => toggleSection("aichat")}
        >
          <span className="text-xs">AI Chat</span>
        </button>
      </div>
    </div>
  );
}