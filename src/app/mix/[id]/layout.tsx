"use client"

import React from 'react';
import { MixEditorProvider, useMixEditor } from './_contexts/MixEditorContext';
import LeftFloater from './_components/LeftFloater';
import MixDebugger from './_components/MixDebugger';
import useMixEditorKeyHandler from './_hooks/useMixEditorKeyHandler';
import ResizableSection from './_components/_fragments/ResizableSection';
import ClassesTree from './_components/Classes/ClassesTree';
import FloaterContainer from './_components/_fragments/FloaterContainer';

// Layout wrapper component with access to context
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { codePageOpen, rightFloaterRef } = useMixEditor();
  
  // KeyboardHandler component to isolate hook usage
  const KeyboardHandler = () => {
    // Use the keyboard shortcuts hook
    useMixEditorKeyHandler();
    // This component doesn't render anything visible
    return null;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex">
      {/* Main content */}
      <div className={`relative ${codePageOpen ? 'w-2/3' : 'w-full'} h-full transition-all duration-300 ease-in-out`}>
        <div className="relative w-full h-full">
          {/* Add the keyboard handler inside the main content */}
          <KeyboardHandler />
          
          <div className="relative w-full h-full overflow-hidden bg-zinc-50 flex items-center justify-center">
            <div className="absolute left-1 flex flex-col items-center z-20">
              <LeftFloater />
            </div>
            <FloaterContainer
              anchor='right-1'
              ref={rightFloaterRef}
            >
              <ResizableSection
                data-main-layer
                defaultWidth={128}
                minWidth={128}
                maxWidth={512}
                handlePosition="left"
                className="h-full flex flex-col justify-between group/tree relative right-floater-resizable"
              >
                  <ClassesTree />
              </ResizableSection>
            </FloaterContainer>
          </div>
          
          <div className="absolute w-full h-full overflow-hidden top-0 left-0">
            {children}
          </div>
        </div>
      </div>
      
      {/* Code section - slides in from right */}
      <div 
        className={`relative ${codePageOpen ? 'w-1/3 opacity-100' : 'w-0 opacity-0'} h-full bg-white overflow-hidden transition-all duration-300 ease-in-out border-l border-gray-200`}
      >
        {codePageOpen && (
          <div className="h-full w-full">
            <MixDebugger />
          </div>
        )}
      </div>
    </div>
  );
};

export default function MixLayout({ children }: { children: React.ReactNode }) {
  return (
    <MixEditorProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </MixEditorProvider>
  );
}
