"use client";

import React from 'react';
import { FolderClosed, Compass, CircleDot, Pyramid, PanelLeft, PanelLeftDashed, Plus, Frame, User  } from 'lucide-react';
import { useDashboardContext } from '../../_contexts/DashboardContext';
import DockButton from './DockButton';

export interface DockProps {
  activeSection?: string | null;
  onSectionChange?: (section: string | null) => void;
  isLocked?: boolean;
  onToggleLock?: () => void;
}

export default function Dock({ 
  activeSection, 
  onSectionChange = () => {},
  isLocked = false,
  onToggleLock = () => {}
}: DockProps) {
  const { sideContentType, setSideContentType } = useDashboardContext();
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-2">

      <div className="w-full flex flex-col items-center gap-1">
      {/* Logo at the top */}
      <button className="w-8 h-8 flex items-center justify-center rounded-md mb-1">
        <Pyramid size={20} className="text-zinc-800" strokeWidth={2.5} />
      </button>
      
      <div className="w-full flex flex-col items-center gap-1">

        {/* Lock/unlock button */}
        <DockButton 
          onClick={onToggleLock}
          tag={isLocked ? "Unlock Dock" : "Lock Dock"}
        >
          {isLocked ? (
            <PanelLeftDashed size={16} className="text-zinc-800" strokeWidth={2} />
          ) : (
            <PanelLeft size={16} className="text-zinc-800" strokeWidth={2} />
          )}
        </DockButton>

        {/* Library Button */}
        <DockButton 
          isActive={activeSection === 'library'}
          tag="Library"
          onClick={() => onSectionChange('library')}
        >
          <FolderClosed size={16} strokeWidth={2} />
        </DockButton>
        
        {/* Explore Button */}
        <DockButton 
          isActive={activeSection === 'explore'}
          tag="Explore"
          onClick={() => onSectionChange('explore')}
        >
          <Compass size={16} strokeWidth={2} />
        </DockButton>
        
        {/* Kit Button */}
        <DockButton 
          isActive={sideContentType === 'kit'}
          tag="Kit"
          onClick={() => {
            onSectionChange('kit');
            setSideContentType(sideContentType === 'kit' ? null : 'kit');
          }}
        >
          <CircleDot size={16} strokeWidth={2} />
        </DockButton>
      </div>


      {/* Spacer */}
      <div className="w-8 h-[1px] bg-gray-200 my-1"></div>


      <div className="relative w-full flex flex-col items-center gap-2">

        {/* Create Button */}
        <DockButton 
          isActive={activeSection === 'create'}
          tag="Create"
          onClick={() => onSectionChange('create')}
        >
          <div className="w-6 h-6 flex items-center justify-center border border-dashed border-zinc-800 rounded-lg">
            <Plus size={16} strokeWidth={2} />
          </div>
        </DockButton>

      <div className="relative">
        {/* Dot */}
        <div className="absolute w-4 h-4 right-[-4] top-[-4] z-10 rounded-full bg-zinc-200 text-xxs text-zinc-800 flex items-center justify-center gap-1">
          3
        </div>
        
          <button 
            className="w-6 h-6 flex items-center justify-center rounded-lg p-1 text-white relative overflow-hidden" 
            style={{
              background: 'radial-gradient(circle, #93c5fd 0%, #2563eb 100%)'
            }}
          >
            {/* Noise overlay */}
            <div 
              className="absolute inset-0 opacity-50 mix-blend-hard-light"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '100px',
              }}
            />
            <Frame size={16} strokeWidth={2} className="z-10 relative" />
          </button>
        </div>
      </div>

      </div>

      <div className="w-full flex flex-col items-center">
        <DockButton 
          isActive={activeSection === 'profile'}
          tag="Profile"
          onClick={() => onSectionChange('profile')}
        >
          <User size={16} strokeWidth={2} />
        </DockButton>
      </div>

    </div>
  );
}
