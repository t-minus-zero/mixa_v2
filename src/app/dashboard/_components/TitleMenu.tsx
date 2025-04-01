"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import UserButton from './UserButton';
import { PanelLeft } from 'lucide-react';
import { useDashboard } from '../../_contexts/DashboardContext';

interface TitleMenuProps {
  title?: string;
  controls?: React.ReactNode;
}

const TitleMenu: React.FC<TitleMenuProps> = ({ title, controls }) => {
 
  return (
    <div className="w-full flex flex-col items-start justify-center gap-4">
      <div className="w-full flex flex-row items-center justify-between">
          <div className={`flex flex-row items-center gap-4 pt-2 transition-all duration-300 ease-in-out`}>
            <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>
          </div>
          <div className="flex flex-row items-center gap-4 pt-2">
            {controls}
            <div className="">
              <UserButton />
            </div>
          </div>
      </div>
    </div>
  );
};

export default TitleMenu;
