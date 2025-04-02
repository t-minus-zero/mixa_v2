'use client'
import React, { useState, useRef, useEffect } from 'react';
import HtmlElement from './HtmlElement';
import AccordionWrapper from './_fragments/AccordionWrapper';
import { useTree } from './TreeContext';
import { SearchIcon, X } from 'lucide-react';



const renderTree = (node: any, level = 0) => (
  <HtmlElement key={node.id} node={node} level={level}>
    {node.childrens && node.childrens.length > 0 && (
      <ul>
        {node.childrens.map((childNode: any) => renderTree(childNode, level + 1))}
      </ul>
    )}
  </HtmlElement>
);

const LeftFloater = () => {
  // Explicitly type the context return to avoid TypeScript errors
  const { tree, selection } = useTree() as { tree: any; selection: any };
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  

  
  const toggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      // When entering search mode, ensure accordion is open
      setIsAccordionOpen(true);
      // Focus search input after rendering
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      // When exiting search mode, clear search text
      setSearchText('');
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  
  // Handle clicks outside of the search area to exit search mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchMode && searchText === '' && 
          searchInputRef.current && 
          !searchInputRef.current.contains(e.target as Node)) {
        setIsSearchMode(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchMode, searchText]);
  
  const toggleAccordion = () => {
    // Only toggle if not in search mode
    if (!isSearchMode) {
      setIsAccordionOpen(!isAccordionOpen);
    }
  };
  
  return (
    <div className="h-full w-full min-w-64 py-4 flex flex-col justify-between group/tree">

      {/* Layers section */}
      <div className={`flex flex-col bg-zinc-50/75 backdrop-blur-md rounded-r-xl shadow-sm border border-zinc-200 max-h-[90vh] overflow-y-scroll transition-all duration-300 ${isSearchMode || isAccordionOpen ? 'w-64' : 'w-32'}`}>
       
        {/* Header with title or search */}
        <div 
          className="w-full p-1 flex flex-row items-center justify-start group transition-colors cursor-pointer border-b border-zinc-200" 
          onClick={toggleAccordion}
        >
          <div className='flex flex-row items-center flex-grow px-2'>
            {isSearchMode ? (
              // Search input
              <div className='cursor-text w-full' onClick={(e) => e.stopPropagation()}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full text-sm bg-transparent outline-none"
                  placeholder="Search..."
                />
              </div>
            ) : (
              // Title "Layers"
              <div className='font-medium text-sm'>
                Layers
              </div>
            )}
          </div>
          <div className='flex flex-row items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
            {/* Search/Close button */}
            <button 
              className={`w-6 h-6 flex items-center justify-center ${isSearchMode ? 'text-zinc-400 hover:text-red-500' : 'text-zinc-400 hover:text-zinc-600'}`}
              onClick={toggleSearch}
            >
              {isSearchMode ? <X size={16} /> : <SearchIcon size={16} />}
            </button>
          </div>
        </div>

        <div className="h-full overflow-y-scroll max-h-[75vh]">
          <AccordionWrapper openStatus={isSearchMode || isAccordionOpen}>
            <ul className="p-2">
              {renderTree(tree)}
            </ul>
          </AccordionWrapper>
        </div>
      </div>
      

    </div>
  );
}

export default LeftFloater;
