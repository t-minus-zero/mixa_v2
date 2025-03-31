"use client"

import React from 'react';
import { useDashboard } from '../../_contexts/DashboardContext';
import SidePanel from './SidePanel';
import AccordionWrapper from '../../mix/[id]/_components/_fragments/AccordionWrapper';

const FloatingMenu: React.FC = () => {
  const { toggleLeftPanel, leftPanelState } = useDashboard();

  return (
    <div className={`z-40 left-0 top-0 flex flex-col py-2 px-2 ${leftPanelState === 'open' ? 'border-r border-zinc-100' : ''}`}>
      {/* App icon - always visible */}
      <div 
        onClick={toggleLeftPanel}
        className="flex justify-center p-1 rounded-full"
      >
        <div className="w-10 h-10 flex items-center text-lg font-bold justify-center text-zinc-800 bg-zinc-0 rounded-full cursor-pointer hover:bg-zinc-100 transition-all duration-300">
          X
        </div>
      </div>

      {/* Side panel with accordion animation */}
      <AccordionWrapper openStatus={leftPanelState === 'open'}>
        <div className="overflow-hidden bg-white shadow-sm h-[calc(100vh-48px)]">
          <SidePanel />
        </div>
      </AccordionWrapper>
    </div>
  );
};

export default FloatingMenu;
