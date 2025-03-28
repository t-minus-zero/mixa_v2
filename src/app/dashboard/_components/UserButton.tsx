"use client"

import React from 'react';
import { User, MoreVertical } from 'lucide-react';

interface UserButtonProps {
  name?: string;
  username?: string;
}

const UserButton: React.FC<UserButtonProps> = ({ 
  name = "Marcus Weber", 
  username = "@marcusweber" 
}) => {
  return (
    <div className="flex items-center justify-between w-full p-2 rounded-full hover:bg-zinc-100 cursor-pointer transition-colors">
      <div className="flex items-center">
        {/* User avatar with background */}
        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center mr-3">
          <User size={20} className="text-zinc-700" />
        </div>
        
        {/* User info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-800">{name}</span>
          <span className="text-xs text-zinc-500">{username}</span>
        </div>
      </div>
      
      {/* Action menu */}
      <button className="p-1 rounded-full hover:bg-zinc-200 transition-colors">
        <MoreVertical size={16} className="text-zinc-600" />
      </button>
    </div>
  );
};

export default UserButton;
