'use client'
import React, { useState, useRef, useEffect } from 'react';
import HtmlElement from '../HtmlElement';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import ResizableSection from '../_fragments/ResizableSection';
import { useMixEditor } from '../../_contexts/MixEditorContext';
import { TreeNode } from '../../_types/types';
import { SearchIcon, X } from 'lucide-react';

const renderTree = (node: TreeNode, level = 0, parentNode: TreeNode | null = null) => (
  <HtmlElement key={node.id} node={node} level={level} parentNode={parentNode}>
    {node.childrens && node.childrens.length > 0 && (
      <ul>
        {node.childrens.map((childNode: TreeNode) => renderTree(childNode, level + 1, node))}
      </ul>
    )}
  </HtmlElement>
);

const ElementsTree = () => {
  // Get tree from MixEditorContext and selection from TreeContext
  const { tree, selection } = useMixEditor();
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

    <div className="relative flex flex-col rounded-3xl shadow-lg border-l border-zinc-200 overflow-hidden backdrop-blur-md max-h-[100vh] w-full transition-all duration-300">
      <ResizableSection
        data-main-layer
        defaultWidth={isAccordionOpen ? 256 : 128}
        minWidth={128}
        maxWidth={512}
        handlePosition="right"
        className="h-full flex flex-col justify-between group/tree relative left-floater-resizable"
      >
        {/* Layers section */}
        <div className="relative w-full h-full transition-all duration-300">
          {/* Header with title or search */}
          <div 
            className="w-full p-1 flex flex-row items-center justify-start transition-colors cursor-pointer border-zinc-200" 
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
            <div data-main-layer-hover className='flex flex-row items-center justify-end transition-opacity'>
              {/* Search/Close button */}
              <button 
                className={`w-6 h-6 flex items-center justify-center ${isSearchMode ? 'text-zinc-400 hover:text-red-500' : 'text-zinc-900 hover:text-zinc-600'}`}
                onClick={toggleSearch}
              >
                {isSearchMode ? <X size={16} strokeWidth={1.5} /> : <SearchIcon size={16} strokeWidth={1.5} />}
              </button>
            </div>
        </div>

          <div className="relative h-full max-h-[100vh] overflow-y-scroll">
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

export default ElementsTree;
