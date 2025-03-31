"use client"

import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserButtonProps {
  initialOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const UserButton: React.FC<UserButtonProps> = ({ 
  initialOpen = false,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div 
      onClick={toggleOpen}
      className="group relative w-10 h-10 rounded-full cursor-pointer"
    >
      {/* Glow effect - the blurred copy that appears on hover */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-70 group-hover:opacity-70 transition-opacity duration-300 blur-md"
        style={{
          background: 'linear-gradient(to bottom, #fafafa 70%, #d4d4d8 100%)',
          transform: 'scale(1.2)',
        }}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center">
          <User size={24} className="text-zinc-700" />
        </div>
      </div>
      
      {/* Actual button with gradient background */}
      <div 
        className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'ring-2 ring-zinc-400' : ''}`}
        style={{
          background: 'linear-gradient(to bottom, #fafafa 70%, #f5f5f5 100%)'
        }}
      >
        <User 
          size={20} 
          className={`text-zinc-700 transition-all duration-300 ease-in-out ${isOpen ? 'scale-90' : 'scale-100'}`} 
        />
      </div>
    </div>
  );
};

export default UserButton;
