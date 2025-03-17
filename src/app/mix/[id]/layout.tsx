"use client"

import React, {useState} from 'react';
import { TreeProvider } from './_components/TreeContext';
import {CssTreeProvider} from './_components/CssTreeContext';
import LeftFloater from './_components/LeftFloater';
import RightFloater from './_components/RightFloater';
import MixDebugger from './_components/MixDebugger';
import Floater from './_components/Sections/Floater';
import { SectionsProvider } from './_components/Sections/SectionsContext';
import SectionsLayout from './_components/Sections/SectionsLayout';
import AiChat from './_components/AiChat/AiChat';

export default function MixLayout({ children }: { children: React.ReactNode }) {
  const [center, setCenter] = useState();

  // Define the content for the left column (AI Chat)
  const leftColumnContent = (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <AiChat />
    </div>
  );

  // Define the content for the right column (Work View)
  const rightColumnContent = (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full overflow-hidden bg-zinc-50 flex items-center justify-center rounded-xl">
        <MixDebugger />
        <div className="absolute left-0 flex flex-col items-center z-20">
          <LeftFloater />
        </div>
        <div className="absolute right-0 flex flex-col items-center z-20">
          <RightFloater />
        </div>

        <div className="absolute bottom-2 z-20">
          <Floater />
        </div>
      </div>
      
      <div className="absolute w-full h-full overflow-hidden top-0 left-0">
        {children}
      </div>
    </div>
  );

  return (
    <SectionsProvider>
      <CssTreeProvider>
        <TreeProvider>
          <div className="relative w-screen h-screen overflow-hidden">
            <SectionsLayout 
              leftContent={leftColumnContent}
              rightContent={rightColumnContent}
            />
          </div>
        </TreeProvider>
      </CssTreeProvider>
    </SectionsProvider>
  );
}
