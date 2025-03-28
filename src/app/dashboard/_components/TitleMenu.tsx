"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import RadioList from './RadioList';
import MenuList from './MenuList';
import { PanelLeft } from 'lucide-react';
import { useDashboard } from '../../_contexts/DashboardContext';

interface TitleMenuProps {
  title?: string;
}

const TitleMenu: React.FC<TitleMenuProps> = ({ title }) => {
  const [selection, setSelection] = useState<string>('Projects');
  const { leftPanelState } = useDashboard();
  const pathname = usePathname();
  
  // Dynamically update title based on the current route
  const getPageTitle = () => {
    if (pathname.includes('/library')) return 'Library';
    if (pathname.includes('/collection')) return 'Collection';
    if (pathname.includes('/projects')) return 'Projects';
    if (pathname.includes('/explore')) return 'Explore';
    if (pathname.includes('/storage')) return 'Storage';
    return title || 'Dashboard';
  };

  return (
    <div className="w-full flex flex-col items-start justify-center gap-4">
      <div className="w-full flex flex-row items-center justify-between">
          <div className={`flex flex-row items-center gap-4 transition-all duration-300 ease-in-out ${leftPanelState === 'open' ? 'ml-0' : 'ml-24'}`}>
            <h2 className="text-lg font-semibold text-zinc-800">{getPageTitle()}</h2>
          </div>
          <div className="flex flex-row items-center gap-4">
            <MenuList list={[{name:"Last Modified", url:"dashboard/"}, {name:"Deleted", url:"dashboard"},]} />
            <RadioList list={[{name:"Cards", url:"dashboard"}, {name:"List", url:"dashboard"}]} />
          </div>
      </div>
    </div>
  );
};

export default TitleMenu;
