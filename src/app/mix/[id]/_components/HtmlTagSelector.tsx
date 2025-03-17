import React, { useState, useRef } from 'react';
import Portal from 'MixaDev/app/_components/portal/Portal';
import { useTree } from './TreeContext';

interface HtmlTagSelectorProps {
  className?: string;
  nodeId: string;
  currentTag: string;
}

export default function HtmlTagSelector({ className, nodeId, currentTag }: HtmlTagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateTag, htmlSchemas } = useTree();

  // Handle tag selection
  const handleSelectTag = (tagName: string) => {
    updateTag(nodeId, tagName);
    setIsOpen(false);
    setFilterText('');
  };

  // Focus the input when dropdown opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter tags based on search text
  const filteredTags = Object.entries(htmlSchemas.elements).filter(
    ([tagName, tagSchema]) => {
      const searchText = filterText.toLowerCase();
      return (
        tagName.toLowerCase().includes(searchText) ||
        (tagSchema.description && tagSchema.description.toLowerCase().includes(searchText))
      );
    }
  );

  return (
    <div className={`flex items-center ${className || ''}`}>
      <button
        ref={buttonRef}
        className="px-2 py-1 text-xxs hover:bg-zinc-50/50 rounded text-zinc-700 transition-colors font-bold tracking-tight uppercase"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentTag || 'div'}
      </button>

      <Portal
        show={isOpen}
        onClickOutside={() => {
          setIsOpen(false);
          setFilterText('');
        }}
        anchorEl={buttonRef}
        placement="bottom-start"
        offset={5}
        autoAdjust={true}
        maxHeight={300}
        className="min-w-[200px] bg-zinc-50 rounded-xl shadow-lg border border-zinc-200 overflow-hidden"
        zIndex={1000}
      >
        <div className="flex flex-col h-full">
          {/* Filter input */}
          <div className="sticky top-0 bg-white border-b border-zinc-200 z-10">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter HTML tags..."
                className="w-full text-xs p-2 rounded focus:outline-none bg-zinc-50"
              />
              {filterText && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  onClick={() => setFilterText('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Tags list */}
          <div className="overflow-y-auto max-h-[250px] no-scrollbar custom-scrollbar">
            {filteredTags.length > 0 ? (
              filteredTags.map(([tagName, tagSchema]) => (
                <div 
                  key={tagName}
                  className="px-2 py-1 text-sm hover:bg-zinc-100 cursor-pointer truncate"
                  onClick={() => handleSelectTag(tagName)}
                >
                  <span className="text-xxs font-medium tracking-tight uppercase">{tagName}</span>
                  {tagSchema.description && (
                    <span className="ml-2 text-xs text-zinc-500 truncate">({tagSchema.description})</span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-zinc-500 italic">
                No matching tags
              </div>
            )}
          </div>
        </div>
      </Portal>
    </div>
  );
}
