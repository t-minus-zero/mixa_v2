"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Compass, HardDrive, Layers, LayoutDashboard, Settings } from 'lucide-react';
import { useDashboard } from '../../_contexts/DashboardContext';

const SidePanel: React.FC = () => {
  const pathname = usePathname();
  const { leftPanelState } = useDashboard();
  
  const isActive = (path: string) => {
    return pathname.includes(path);
  };
  
  return (
    <div className="h-full w-full flex flex-col justify-between py-2">
      <div className="w-full">
        <nav className="flex flex-col items-center gap-2 w-full">
          <Link href="/dashboard" 
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-all duration-300 ease-in-out cursor-pointer ${isActive('/dashboard') && pathname === '/dashboard' ? 'text-blue-500' : 'text-zinc-800'}`}>
            <LayoutDashboard size={20} />
          </Link>
          <Link href="/dashboard/library" 
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-all duration-300 ease-in-out cursor-pointer ${isActive('/dashboard/library') ? 'text-blue-500' : 'text-zinc-800'}`}>
            <FolderOpen size={20} />
          </Link>
          <Link href="/dashboard/collection" 
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-all duration-300 ease-in-out cursor-pointer ${isActive('/dashboard/collection') ? 'text-blue-500' : 'text-zinc-800'}`}>
            <Layers size={20} />
          </Link>
          <Link href="/dashboard/explore" 
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-all duration-300 ease-in-out cursor-pointer ${isActive('/dashboard/explore') ? 'text-blue-500' : 'text-zinc-800'}`}>
            <Compass size={20} />
          </Link>
          <Link href="/dashboard/storage" 
                className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-all duration-300 ease-in-out cursor-pointer ${isActive('/dashboard/storage') ? 'text-blue-500' : 'text-zinc-800'}`}>
            <HardDrive size={20} />
          </Link>
        </nav>
      </div>

      {/* Settings button at bottom */}
      <div className="w-full flex justify-center mb-4">
        <Link href="/settings" 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-800 transition-all duration-300 ease-in-out cursor-pointer">
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
};

export default SidePanel;
