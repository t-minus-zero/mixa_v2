"use client"
import { useRouter } from "next/navigation";
import { formatDistanceToNow, isValid } from "date-fns";
import { Box, Check } from "lucide-react";
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
        style={{ gridTemplateColumns: "1fr", gridTemplateRows: "1fr 1fr" }}
        className={`w-full h-80 bg-zinc-0 border ${isSelected ? 'border-blue-500 border-2' : 'border-zinc-200'} rounded-xl cursor-pointer overflow-hidden group grid relative`}>
        <div className="p-6 flex flex-row justify-between items-start gap-4 group">
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
            <button className="flex flex-row items-center justify-center rounded-full hover:bg-white border border-zinc-300 font-bold text-sm text-zinc-500 w-8 h-8 leading-5"> &#8942; </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-end -mb-12 group-hover:-mb-24 transition-all duration-300 ease-in-out">
          <div 
            className="w-5/6 h-full ">
            <img
              className="rounded-xl object-cover w-full h-full" 
              src="https://utfs.io/f/9ff23c88-bd7a-40ce-ab9d-6d25d73d8ccf-n9ys8r.jpg" 
              alt="Component image" />
          </div>
        </div>
      </div>
    );
  }

export default MixCard;