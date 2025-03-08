'use client'
import React, { useState, useMemo } from 'react';
import CssClassElement from './CssClassElement';
import { useCssTree } from './CssTreeContext';
import { useTree } from './TreeContext';
import { v4 as uuidv4 } from 'uuid';

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
      className="w-full bg-zinc-100 border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 py-2 px-4 rounded-lg text-xs transition-colors"
    >
      {isForSelectedElement ? 'Add Class to Selected Element' : 'Add New Class'}
    </button>
  );
};

const SearchWithButtons = ({ searchValue, onSearchChange, showAllClasses, onToggleView }) => {
  return (
    <div className="flex flex-row items-stretch rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
      <div className="flex-grow"> 
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-2 py-2 text-sm focus:outline-none focus:border-blue-400 bg-transparent"
        />
      </div>
      <div 
        className={`flex items-center border-l border-zinc-200 px-3 cursor-pointer text-sm ${
          showAllClasses 
            ? 'bg-zinc-200 text-zinc-600' 
            : 'bg-transparent text-zinc-400 hover:text-zinc-600'
        }`} 
        onClick={onToggleView}
      >
        All
      </div>
    </div>
  )
}

const RightFloater = () => {
  const { cssTree } = useCssTree();
  const { selection } = useTree();
  const { addClass } = useCssTree();
  const { selectClass } = useCssTree();
  const { updateTree } = useTree();
  const { setSelection } = useTree();
  
  // Change from string to boolean toggle
  const [showAllClasses, setShowAllClasses] = useState(false);
  // Add state for search input
  const [searchInput, setSearchInput] = useState('');
  
  // Handle toggle view mode
  const handleToggleView = () => {
    setShowAllClasses(!showAllClasses);
  };

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
      className="h-full min-w-52 max-w-80 mr-2 flex flex-col justify-between group/tree">
      <div className="flex flex-col gap-2 max-h-[calc(100vh-6rem)] overflow-hidden">
        <SearchWithButtons 
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          showAllClasses={showAllClasses}
          onToggleView={handleToggleView}
        />
        <div className="overflow-y-scroll flex-grow">
          <div className="flex-1 overflow-y-auto">
            {!showAllClasses && classesToDisplay.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No classes on selected element
              </div>
            ) : (
              <ul className="w-full h-full gap-2 flex flex-col">
                {classesToDisplay.map((className) => (
                  <CssClassElement key={className} className={className} />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="borderborder-zinc-200">
          <AddClassButton isForSelectedElement={!showAllClasses} />
        </div>
      </div>
    </div>
  );
};

export default RightFloater;
