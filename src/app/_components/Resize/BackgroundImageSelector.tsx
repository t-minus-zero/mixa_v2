'use client';

import React, { useState } from 'react';
import { Image } from 'lucide-react';

interface BackgroundImageSelectorProps {
  backgroundImageUrl: string;
  onBackgroundImageChange: (url: string) => void;
}

const BackgroundImageSelector: React.FC<BackgroundImageSelectorProps> = ({
  backgroundImageUrl,
  onBackgroundImageChange
}) => {
  const [showImageInput, setShowImageInput] = useState(false);

  const handleImageUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('imageUrl') as HTMLInputElement;
    if (input && input.value) {
      onBackgroundImageChange(input.value);
      setShowImageInput(false);
    }
  };

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput);
  };

  // Renders either the input form or the toggle button
  return (
    <>
      {showImageInput ? (
        <div className="absolute top-10 right-0 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md border border-zinc-200">
          <form onSubmit={handleImageUrlSubmit} className="flex flex-col gap-2">
            <input 
              type="text" 
              name="imageUrl"
              placeholder="Enter image URL" 
              className="px-2 py-1 text-sm rounded border border-gray-300" 
              defaultValue={backgroundImageUrl}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={toggleImageInput}
                className="bg-zinc-400 hover:bg-zinc-500 text-white px-2 py-1 text-xs rounded"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded"
              >
                Set
              </button>
            </div>
          </form>
        </div>
      ) : null}
      
      <button 
        onClick={toggleImageInput} 
        className={`hover:bg-zinc-100/50 backdrop-blur-sm px-2 py-1 rounded-lg ${backgroundImageUrl ? 'text-blue-500' : ''}`}
        title={backgroundImageUrl ? 'Change Background Image' : 'Set Background Image'}
      >
        <Image size={16} />
      </button>
    </>
  );
};

export default BackgroundImageSelector;
