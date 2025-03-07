'use client'
import React, { useState } from 'react';
import CssClassElement from './CssClassElement';
import { useCssTree } from './CssTreeContext';
import { useTree } from './TreeContext';
import { v4 as uuidv4 } from 'uuid';

// Add Class Button Component
const AddClassButton = ({ isForSelectedElement }) => {
  const { addClass } = useCssTree();
  const { addClass: addClassToElement, selection } = useTree();
  
  const handleAddClass = () => {
    // Generate a new class name
    const newClassName = uuidv4().substring(0, 6);
    
    // Add the class to the CSS Tree
    addClass(newClassName);
    
    // If we're in selected element mode, also add the class to the selected element
    if (isForSelectedElement && selection) {
      addClassToElement(selection.id, newClassName);
      console.log(`Added class "${newClassName}" to selected element`);
    } else {
      console.log(`Created new class: "${newClassName}"`);
    }
  };
  
  return (
    <button 
      onClick={handleAddClass}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
    >
      {isForSelectedElement ? 'Add Class to Selected Element' : 'Add New Class'}
    </button>
  );
};

const RightFloater = () => {
  const { cssTree } = useCssTree();
  const { selection } = useTree();
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'selected'

  // Determine which classes to display based on view mode
  const classesToDisplay = viewMode === 'all' 
    ? Object.keys(cssTree.classes) 
    : (selection.classes || []).filter(className => cssTree.classes[className]);

  return (
    <div 
      className="h-full min-w-52 max-w-80 flex flex-col justify-between group/tree">
      <div className="flex flex-col bg-zinc-50 rounded-xl gap-2 max-h-[calc(100vh-6rem)] overflow-hidden">
        <div className="flex flex-row justify-between items-center p-2 border-b border-zinc-200">
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'hover:bg-zinc-200'}`}
              onClick={() => setViewMode('all')}
            >
              All Classes
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${viewMode === 'selected' ? 'bg-blue-500 text-white' : 'hover:bg-zinc-200'}`}
              onClick={() => setViewMode('selected')}
            >
              Selected Element
            </button>
          </div>
          <button className="w-6 h-6 hover:bg-zinc-100 rounded-lg text-center">+</button>
        </div>
        <div className="overflow-y-scroll flex-grow">
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'selected' && classesToDisplay.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No classes on selected element
              </div>
            ) : (
              <ul className="w-full h-full">
                {classesToDisplay.map((className) => (
                  <CssClassElement key={className} className={className} />
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="p-3 border-t border-zinc-200">
          <AddClassButton isForSelectedElement={viewMode === 'selected'} />
        </div>
      </div>
    </div>
  );
};

export default RightFloater;
