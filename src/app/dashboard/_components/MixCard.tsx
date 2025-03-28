"use client"
import { useRouter } from "next/navigation";
import { formatDistanceToNow, isValid } from "date-fns";
import { Box, Check, Image as ImageIcon } from "lucide-react";
import { useDashboard } from "../../_contexts/DashboardContext";

interface MixCardProps {
  id: number;
  mName: string;
  updatedAt?: Date | string | null;
}

const MixCard = ({ id, mName, updatedAt }: MixCardProps) => {
  const router = useRouter();
  const { toggleMixSelection, isMixSelected } = useDashboard();
  const isSelected = isMixSelected(id);

  // Handle click for selection
  const handleClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent triggering the parent's click handler
    e.stopPropagation();
    
    // Check if control or command key is pressed
    const isMultiSelectMode = e.ctrlKey || e.metaKey;
    toggleMixSelection(id, isMultiSelectMode);
  };
  
  // Standard double-click handler for navigation
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/mix/${id}`);
  };
  // Format the time since last edit
  const getRelativeTime = () => {
    if (!updatedAt) return "Edited";
    
    const date = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
    
    if (!isValid(date)) return "Edited";
    
    try {
      const timeDistance = formatDistanceToNow(date, { addSuffix: false });
      
      // Replace "less than a minute" with "just now"
      if (timeDistance === "less than a minute") {
        return "Edited just now";
      }
      
      return `Edited ${timeDistance} ago`;
    } catch (error) {
      return "Edited";
    }
  };
  
  const relativeTime = getRelativeTime();
    return (
      <div 
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`w-full aspect-[1/1] bg-zinc-50 border ${isSelected ? 'border-zinc-800' : 'border-zinc-50'} relative rounded-xl cursor-pointer overflow-hidden group flex flex-col transition-all duration-300`}>
        
        <div className="p-6 flex flex-row items-center justify-between items-start gap-4 group">
          <div className="flex flex-row items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-full">
              <Box size={16} className="text-zinc-800" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="text-sm font-bold text-zinc-700">{mName}</span>
              <p className="text-xs text-zinc-500">{relativeTime}</p>
            </div>
          </div>
          <div className="text-zinc-900 cursor-pointer leading-5">
            <button className="flex flex-row items-center justify-center rounded-full hover:bg-white border-zinc-300 font-bold text-sm text-zinc-500 w-8 h-8 leading-5"> &#8942; </button>
          </div>
        </div>
        <div className=" hidden flex flex-col px-6 w-full">
          <p className="text-zinc-500 text-sm pr-2"> John Doe is working on this mix. <br /> [AI employee] </p>
        </div>

        <div className="absolute flex w-full h-full flex-col items-center justify-end bottom-[-20%] group-hover:bottom-[-40%] transition-all duration-300 ease-in-out ">
          <div 
            className="w-full h-full px-6 [background:linear-gradient(180deg,rgba(250,250,252,0.00)_0%,#FAFAFC_28.7%)]">
            <div className="rounded-xl mt-12 w-full h-full flex items-center justify-center bg-zinc-200">
              <ImageIcon size={48} className="text-zinc-400" />
            </div>
          </div>
        </div>

      </div>
    );
  }

export default MixCard;