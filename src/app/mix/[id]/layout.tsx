"use client"

import React from 'react';
import { TreeProvider } from './_components/TreeContext';
import { CssTreeProvider } from './_components/CssTreeContext';
import LeftFloater from './_components/LeftFloater';
import RightFloater from './_components/RightFloater';
import MixDebugger from './_components/MixDebugger';
import useMixEditorKeyHandler from './_hooks/useMixEditorKeyHandler';

export default function MixLayout({ children }: { children: React.ReactNode }) {

  // KeyboardHandler component to isolate hook usage
  const KeyboardHandler = () => {
    // Use the keyboard shortcuts hook
    useMixEditorKeyHandler();
    // This component doesn't render anything visible
    return null;
  };

  // Define the content for the main column (Work View)
  const mainContent = (
    <div className="relative w-full h-full">
      {/* Add the keyboard handler inside the main content */}
      <KeyboardHandler />
      
      <div className="relative w-full h-full overflow-hidden bg-zinc-50 flex items-center justify-center rounded-xl">
        <MixDebugger />
        <div className="absolute left-0 flex flex-col items-center z-20">
          <LeftFloater />
        </div>
        <div className="absolute right-0 flex flex-col items-center z-20">
          <RightFloater />
        </div>
      </div>
      
      <div className="absolute w-full h-full overflow-hidden top-0 left-0">
        {children}
      </div>
    </div>
  );

  return (
    <CssTreeProvider>
      <TreeProvider>
        <div className="relative w-screen h-screen overflow-hidden">
          {mainContent}
        </div>
      </TreeProvider>
    </CssTreeProvider>
  );
}
