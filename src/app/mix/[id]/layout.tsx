"use client"

import React, {useState} from 'react';
import { TreeProvider } from './_components/TreeContext';
import LeftFloater from './_components/LeftFloater';
import RightFloater from './_components/RightFloater';
import { use } from 'react';

export default function MixLayout({ children }: { children: React.ReactNode }) {

  const [center, setCenter] = useState();

  return (
    <TreeProvider>
      <div className="relative w-screen h-screen overflow-hidden bg-zinc-100 flex items-center justify-center">
        <div className="absolute left-0 flex flex-col items-center z-20">
          <LeftFloater />
        </div>
        <div className="absolute right-0 flex flex-col items-center z-20">
          <RightFloater />
        </div>

        <div className="absolute top-0 flex flex-row p-4 bg-zinc-50 justify-center items-center z-20">
        </div>
        
        <div className="absolute w-screen h-screen overflow-hidden top-0 left-0">
          {children}
        </div>
      </div>
    </TreeProvider>
  );
}
