"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Compass, HardDrive, Layers, LayoutDashboard } from 'lucide-react';
import UserButton from './UserButton';

const SidePanel: React.FC = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <div className="pt-8 h-full w-full flex flex-col justify-between pb-4 shadow-sm">
      <div className="w-full pt-4">

        <nav className="flex flex-col justify-center w-full px-1">
          <Link href="/dashboard" 
                className={`flex items-center px-4 py-2 flex flex-row gap-2 text-zinc-700 hover:bg-zinc-50 transition-all duration-300 ease-in-out rounded-full cursor-pointer ${isActive('/dashboard') && pathname === '/dashboard' ? 'bg-zinc-100 font-semibold' : ''}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/dashboard/library" 
                className={`flex items-center px-4 py-2 flex flex-row gap-2 text-zinc-700 hover:bg-zinc-50 transition-all duration-300 ease-in-out rounded-full cursor-pointer ${isActive('/dashboard/library') ? 'bg-zinc-100 font-semibold' : ''}`}>
            <FolderOpen size={18} />
            Library
          </Link>
          <Link href="/dashboard/collection" 
                className={`flex items-center px-4 py-2 flex flex-row gap-2 text-zinc-700 hover:bg-zinc-50 transition-all duration-300 ease-in-out rounded-full cursor-pointer ${isActive('/dashboard/collection') ? 'bg-zinc-100 font-semibold' : ''}`}>
            <Layers size={18} />
            Collection
          </Link>
          <Link href="/dashboard/explore" 
                className={`flex items-center px-4 py-2 flex flex-row gap-2 text-zinc-700 hover:bg-zinc-50 transition-all duration-300 ease-in-out rounded-full cursor-pointer ${isActive('/dashboard/explore') ? 'bg-zinc-100 font-semibold' : ''}`}>
            <Compass size={18} />
            Explore
          </Link>
          <Link href="/dashboard/storage" 
                className={`flex items-center px-4 py-2 flex flex-row gap-2 text-zinc-700 hover:bg-zinc-50 transition-all duration-300 ease-in-out rounded-full cursor-pointer ${isActive('/dashboard/storage') ? 'bg-zinc-100 font-semibold' : ''}`}>
            <HardDrive size={18} />
            Storage
          </Link>
        </nav>
      </div>

      {/* User button positioned at bottom */}
      <div className="w-full mt-auto">
        <UserButton />
      </div>
    </div>
  );
};

export default SidePanel;
