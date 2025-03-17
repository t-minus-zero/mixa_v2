'use client'
import React, { useState, useMemo, useRef, useEffect } from 'react';
import CssClassElement from './CssClassElement';
import { useCssTree } from './CssTreeContext';
import { useTree } from './TreeContext';
import { v4 as uuidv4 } from 'uuid';
import HtmlContent from './HtmlContent';
import { SearchIcon, X } from 'lucide-react';
import AccordionWrapper from './_fragments/AccordionWrapper';

// Add Class Button Component
const AddClassButton = ({ isForSelectedElement }) => {
  const { addClass, selectClass } = useCssTree();
  const { selection, setSelection } = useTree();
  const { addClass: addClassToElement } = useTree();
  
  const handleAddClass = () => {
    // Generate a new class name
    const newClassName = uuidv4().substring(0, 6);
    
    // Add the class to the CSS Tree
    addClass(newClassName);
    
    // If we're in selected element mode, also add the class to the selected element
    if (isForSelectedElement && selection) {
      addClassToElement(selection.id, newClassName);
      
      // Force a re-render of the selection by creating a new reference
      setSelection({...selection});
      
      // Also select the newly created class in the CSS tree
      selectClass(newClassName);
      
      console.log(`Added class "${newClassName}" to selected element`);
    } else {
      // Just select the new class in the CSS tree
      selectClass(newClassName);
      console.log(`Created new class: "${newClassName}"`);
    }
  };
  
  return (
    <button 
      onClick={handleAddClass}
      className="w-full border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50/50 hover:text-blue-400 py-2 px-4 text-xs transition-colors flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {isForSelectedElement ? 'Add Class to Selected Element' : 'Add New Class'}
    </button>
  );
};

// Define interface for ClassesFloater props
interface ClassesFloaterProps {
  classesToDisplay: string[];
  showAllClasses: boolean;
  setShowAllClasses: (show: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

const ClassesFloater = ({ classesToDisplay, showAllClasses, setShowAllClasses, searchText, setSearchText }: ClassesFloaterProps) => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const toggleAccordion = () => {
    // Only toggle if not in search mode
    if (!isSearchMode) {
      setIsAccordionOpen(!isAccordionOpen);
    }
  };
  
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
  
  // Toggle between showing all classes or just selected element's classes
  const toggleShowAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllClasses(!showAllClasses);
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

  return (
    <div className={`flex flex-col bg-zinc-50/75 backdrop-blur-md rounded-l-xl shadow-sm border border-zinc-200 max-h-[90vh] overflow-hidden transition-all duration-300 ${isSearchMode || isAccordionOpen ? 'w-64' : 'w-36'}`}>
      
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
              // Title "Classes"
              <div className='font-medium text-sm'>
                Classes
              </div>
            )}
          </div>
          <div className='flex flex-row items-center justify-end'>
            {/* Search/Close button */}
            <button 
              className={`w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isSearchMode ? 'text-zinc-400 hover:text-red-500' : 'text-zinc-400 hover:text-zinc-600'}`}
              onClick={toggleSearch}
            >
              {isSearchMode ? <X size={16} /> : <SearchIcon size={16} />}
            </button>
            
            {/* All toggle button */}
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
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
              {classesToDisplay.map((className) => (
                <CssClassElement key={className} className={className} />
              ))}
            </ul>
          )}
          <div className="w-full p-2 pt-0">
            <AddClassButton isForSelectedElement={!showAllClasses} />
          </div>
        </AccordionWrapper>
      </div>
      
    </div>
  );
};

const RightFloater = () => {
  const { cssTree } = useCssTree();
  const { selection } = useTree();
  const { addClass } = useCssTree();
  const { selectClass } = useCssTree();
  const { updateTree } = useTree();
  const { setSelection } = useTree();
  
  // State for toggling between all classes and selected element's classes
  const [showAllClasses, setShowAllClasses] = useState(false);
  // State for search input
  const [searchInput, setSearchInput] = useState('');
  
  // Get classes to display based on current mode and selection
  const classesToDisplay = useMemo(() => {
    // First get the base list of classes based on view mode
    let classes = [];
    
    if (showAllClasses) {
      classes = Object.keys(cssTree.classes);
    } else {
      classes = selection && selection.classes ? selection.classes : [];
    }
    
    // Then filter by search term if one exists
    if (searchInput.trim()) {
      const search = searchInput.toLowerCase().trim();
      classes = classes.filter(className => 
        className.toLowerCase().includes(search)
      );
    }
    
    return classes;
  }, [cssTree.classes, selection, showAllClasses, searchInput]);

  return (
    <div 
      className="h-full w-full w-64 flex flex-col justify-between items-end group/tree">
      <div className="flex flex-col items-end max-h-[calc(100vh-6rem)] overflow-hidden">
        <ClassesFloater 
          classesToDisplay={classesToDisplay}
          showAllClasses={showAllClasses}
          setShowAllClasses={setShowAllClasses}
          searchText={searchInput}
          setSearchText={setSearchInput}
        />

        
        {/* Add HtmlContent component when an element is selected */}
        {selection && !showAllClasses && <HtmlContent />}
      </div>
    </div>
  );
};

export default RightFloater;
