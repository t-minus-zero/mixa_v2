'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react';
import CssClassElement from '../CssClassElement';
import { useMixEditor } from '../../_contexts/MixEditorContext';
import { SearchIcon, X, Plus } from 'lucide-react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import {findNodeById } from '../../_utils/treeUtils';
import AddClassButton from './AddClass';


const ClassesTree = () => {
  const { selection, cssTree, tree } = useMixEditor();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const toggleAccordion = () => {
    if (!isSearchMode) {
      setIsAccordionOpen(!isAccordionOpen);
    }
  };
  
  const toggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchMode(!isSearchMode);
    if (!isSearchMode) {
      setIsAccordionOpen(true);
      // Focus search input after rendering
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      // When exiting search mode, clear search text
      setSearchInput('');
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  
  // Toggle between showing all classes or just selected element's classes
  const toggleShowAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllClasses(!showAllClasses);
  };

  // Get classes to display based on current mode and selection
  const classesToDisplay = (() => {
    // Start with all classes from cssTree
    let classes = [...cssTree.classes];
    
    // Filter by selection if not showing all classes
    if (!showAllClasses && selection) {
      // Get fresh reference to the current selection from the tree
      // This ensures we always have the latest version of the selection
      const currentNode = findNodeById(tree, selection.id);
      const selectionClassIds = currentNode ? currentNode.classes : [];
      classes = classes.filter(cssClass => selectionClassIds.includes(cssClass.id));
    }
    
    // Then filter by search term if one exists
    if (searchInput.trim()) {
      const search = searchInput.toLowerCase().trim();
      classes = classes.filter(cssClass => 
        cssClass.name.toLowerCase().includes(search)
      );
    }
    
    return classes;
  })();
  
  // Handle clicks outside of the search area to exit search mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSearchMode && searchInput === '' && 
          searchInputRef.current && 
          !searchInputRef.current.contains(e.target as Node)) {
        setIsSearchMode(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchMode, searchInput]);

  return (
    <div className={`flex flex-col backdrop-blur-md rounded-3xl bg-gray-100/0 w-full max-h-[90vh] overflow-hidden transition-all duration-300 ${isSearchMode || isAccordionOpen ? 'w-64' : 'w-32'}`}>
      
      {/* Header with title or search */}
      <div 
          className="w-full p-1 flex flex-row items-center justify-start group transition-colors cursor-pointer" 
          onClick={toggleAccordion}
        >
          <div className='flex flex-row items-center flex-grow px-2'>
            {isSearchMode ? (
              // Search input
              <div className='cursor-text w-full' onClick={(e) => e.stopPropagation()}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full text-sm bg-transparent outline-none"
                  placeholder="Search..."
                />
              </div>
            ) : (
              // Title "Classes"
              <div className='font-medium text-sm'>
                Classes
              </div>
            )}
          </div>
          <div className='flex flex-row items-center justify-end gap-1'>
            {/* Add Class button */}
            <AddClassButton />
            
            {/* Search/Close button */}
            <button 
              className={`w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isSearchMode ? 'text-zinc-400 hover:text-red-500' : 'text-zinc-400 hover:text-zinc-600'}`}
              onClick={toggleSearch}
            >
              {isSearchMode ? <X size={16} /> : <SearchIcon size={16} />}
            </button>
            
            {/* All toggle button */}
            <button
              className={`p-1 text-xs rounded transition-colors ${
                showAllClasses 
                  ? 'bg-zinc-50/50 text-zinc-600 font-medium' 
                  : 'bg-transparent text-zinc-400 hover:text-zinc-600'
              }`}
              onClick={toggleShowAll}
            >
              All
            </button>
          </div>
      </div>

      {/* Accordion content */}
      <div className="overflow-y-auto">
        <AccordionWrapper openStatus={isSearchMode || isAccordionOpen}>
          {!showAllClasses && classesToDisplay.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No classes on selected element
            </div>
          ) : (
            <ul className="w-full gap-2 flex flex-col p-2">
              {classesToDisplay.map((cls) => (
                <CssClassElement key={cls.id} cls={cls} />
              ))}
            </ul>
          )}
        </AccordionWrapper>
      </div>
      
    </div>
  );
};

export default ClassesTree;
