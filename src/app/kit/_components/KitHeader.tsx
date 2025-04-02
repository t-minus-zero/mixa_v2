"use client";

import React from "react";
import { PanelLeftClose, Bolt, ChevronsUpDown } from "lucide-react";
import DockButton from "../../os/_components/dock/DockButton";
import { useKitContext } from "../_contexts/KitContext";
import { useDashboardContext } from "../../os/_contexts/DashboardContext";

/**
 * KitHeader - Header component for the chat interface with chat selection and controls
 */
const KitHeader: React.FC = () => {
  const { currentChat } = useKitContext();
  const { setSideContentType } = useDashboardContext();
  
  return (
    <div className="w-full sticky top-0 left-0 right-0 z-50">
      <div className="absolute top-0 left-0 right-0 w-full h-full bg-gradient-to-b from-zinc-50 via-zinc-100/95 to-zinc-50/0">
      </div>
      {/* Header content */}
      <div className="relative w-full z-20 p-2 flex flex-row items-center justify-between">

        {/* Left side */}
        <div className="flex flex-row items-center justify-center gap-1">

          <DockButton 
            isActive={true}
            tag="Close Panel"
            onClick={() => setSideContentType(null)}
          >
            <PanelLeftClose size={16} className="text-zinc-800" strokeWidth={2} />
          </DockButton>

          <DockButton isActive={true} tag="Change chat">
            <div className="flex flex-row items-center px-2 py-1 rounded-md bg-zinc-100 transition-colors text-sm text-zinc-800">
              {currentChat?.name || "New Chat"}
              <ChevronsUpDown size={14} className="ml-1 text-zinc-500" />
            </div>
          </DockButton>

        </div>
        
        {/* Right side */}
        <div className="flex flex-row items-center gap-1">
          <DockButton isActive={true} tag="Settings">
            <Bolt size={16} className="text-zinc-800" strokeWidth={2} />
          </DockButton>
        </div>

      </div>

    </div>
  );
};

export default KitHeader;
