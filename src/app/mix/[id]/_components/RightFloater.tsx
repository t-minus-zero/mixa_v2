'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react';
import CssClassElement from './CssClassElement';
import { useMixEditor } from '../_contexts/MixEditorContext';
import { v4 as uuidv4 } from 'uuid';
import HtmlContent from './HtmlContent';
import { SearchIcon, X, Plus } from 'lucide-react';
import AccordionWrapper from './_fragments/AccordionWrapper';
import ResizableSection from './_fragments/ResizableSection';
import { addClassToElement, addClass, findNodeById } from '../_utils/treeUtils';

// Add Class Button Component
const AddClassButton = () => {
  const { tree, updateTree, selection, updateCssTree, cssTree, selectClass } = useMixEditor();
  
  const handleAddClass = async () => {
    // Generate a new class ID
    const newClassId = uuidv4().substring(0, 6);
    
    // First update the CSS tree with the new class
    updateCssTree(cssTree => {
      addClass(cssTree, newClassId);
    });
    
    // If we have a selection, add the class to the selected element
    if (selection) {
      // Small timeout to ensure the CSS tree is updated first
      setTimeout(() => {
        updateTree(tree => {
          addClassToElement(tree, selection.id, newClassId);
        });
        
        console.log(`Added class with id "${newClassId}" to selected element`);
      }, 0);
    }
  };
  
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        handleAddClass();
      }}
      className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-blue-500 transition-colors"
    >
      <Plus size={16} strokeWidth={1.5} />
    </button>
  );
};

// Define interface for ClassesFloater props
interface ClassesFloaterProps {
  classesToDisplay: Array<{id: string, name: string}>;
  showAllClasses: boolean;
  setShowAllClasses: (show: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

const ClassesFloater = () => {
  const { selection, updateTree, setSelection, updateCssTree, cssTree, addClass, selectClass, tree } = useMixEditor();
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

const RightFloater = () => {
  const { selection, updateTree, setSelection, rightFloaterRef } = useMixEditor();
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  return (
    <div 
      ref={rightFloaterRef}
      className="h-full w-full w-64 flex flex-col rounded-3xl shadow-2xl overflow-hidden justify-between items-end group/tree">
        <ResizableSection
        data-main-layer
        defaultWidth={isAccordionOpen ? 256 : 128}
        minWidth={128}
        maxWidth={512}
        handlePosition="left"
        className="h-full flex flex-col justify-between group/tree relative right-floater-resizable"
      >
        <ClassesFloater />
      </ResizableSection>
    </div>
  );
};

export default RightFloater;
