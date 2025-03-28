"use client"

import React from 'react';
import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { useDashboard } from '../../_contexts/DashboardContext';

const FloatingMenu: React.FC = () => {
  const { toggleLeftPanel, leftPanelState } = useDashboard();
  return (
    <div 
      onClick={toggleLeftPanel}
      className={`fixed z-30 top-3 ${leftPanelState === 'open' ? 'left-4' : 'left-6'} flex flex-row items-center gap-2 rounded-lg py-1 px-2 cursor-pointer hover:bg-zinc-100/90 transition-all duration-300 ease-in-out`}
    >
      <div className="w-6 h-6 flex items-center text-xs font-bold justify-center text-zinc-50 bg-zinc-900 rounded-lg">m</div>
      <span className={`font-bold text-zinc-900 transition-all duration-300 ease-in-out ${leftPanelState === 'open' ? 'text-2xl' : 'text-lg'}`}>mixa</span>
      {leftPanelState === 'open' 
        ? <PanelLeftClose size={20} className="text-zinc-700" /> 
        : <PanelLeft size={20} className="text-zinc-700" />}
    </div>
  );
};

export default FloatingMenu;
