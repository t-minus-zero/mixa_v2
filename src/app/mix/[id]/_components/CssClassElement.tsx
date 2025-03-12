 "use client"

import React, { useState, useEffect } from 'react';
import { useCssTree } from './CssTreeContext';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import PropertyElement from './PropertyElement';
import PropertySelector from './PropertySelector';
import InputClickAndText from './_fragments/InputClickAndText';

// component for a class in the css tree
// renders a collapsible section with a class name and its properties components
interface CssClassElementProps {
  className: string;
  children?: React.ReactNode;
}

const TitleWithButtons = ({ className, onToggle, openStatus, onDelete, onChange }) => { 
  return (
    <div className="w-full p-2 flex flex-row items-center justify-start group hover:bg-zinc-50 rounded-md transition-colors cursor-pointer" onClick={onToggle}>
      <div className='flex flex-row items-center flex-grow ' >
        <div className='cursor-text' onClick={(e) => e.stopPropagation()}>
          <InputClickAndText id={className} initValue={className} updateValue={onChange} />
        </div>
      </div>
      <div className='flex flex-row items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
        
        {/* Edit button - no functionality for now */}
        <button className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        {/* Copy button - no functionality for now */}
        <button className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-zinc-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        
        {/* Delete button - with functionality */}
        <button 
          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function CssClassElement({ className, children }: CssClassElementProps) {
  const { 
    cssTree, 
    addClass, 
    removeClass, 
    selectClass, 
    addProperty,
    generateCss,
    cssSchemas, //inputTypes and properties schemas
    renameClass
  } = useCssTree();
  
  const { 
    selection, 
    removeClass: removeClassFromElement,
    renameClassesInTree
  } = useTree();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the class object from the context using className
  const classObj = cssTree.classes[className];
  
  // Handle updating class name (remember to refractor when we switch to IDs for classes instead of names)
  const handleUpdateClassName = (newClassName) => {
    if (newClassName !== className && newClassName.trim()) {
      // Rename the class in CssTreeContext
      const success = renameClass(className, newClassName);
      
      if (success) {
        // Update all references to this class name in the tree
        renameClassesInTree(className, newClassName);
        console.log(`Renamed class from ${className} to ${newClassName}`);
      } else {
        console.log(`Failed to rename class from ${className} to ${newClassName}`);
      }
    }
  };
  
  // Handle deleting class
  const handleDeleteClass = () => {
    // Remove class from CssTree
    removeClass(className);
    
    // If there's a selected element, also remove the class from it
    if (selection && selection.classes && selection.classes.includes(className)) {
      removeClassFromElement(selection.id, className);
    }
  };
  
  // Handle property selection from PropertySelector
  const handleAddProperty = (propertyType) => {
    // Add the property to the class
    addProperty(className, propertyType);
    
    // Expand the accordion to show the newly added property
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  if (!classObj) {
    return (
      <div className="p-2 text-sm text-gray-500">
        No class found for {className}
      </div>
    );
  }
  
  return (
    <li className={`w-full bg-zinc-100 rounded-lg border ${isOpen ? 'border-blue-400' : 'border-zinc-200'}`}>
      <div 
        className="relative flex flex-start group" 
      >
        <TitleWithButtons 
          className={className}
          onToggle={() => setIsOpen(!isOpen)}
          openStatus={isOpen}
          onDelete={handleDeleteClass}
          onChange={handleUpdateClassName}
        />
      </div>
      <AccordionWrapper openStatus={isOpen}>
        <div className="border-t border-zinc-200">
          {/* Properties list */}
          {classObj.properties && Array.isArray(classObj.properties) && classObj.properties.map((property) => (
            <div key={property.id} className="">
              <PropertyElement
                classId={className}
                property={property}
              />
            </div>
          ))}
          
          {/* Property selector */}
          <PropertySelector
            className={className}
            onAddProperty={handleAddProperty}
          />
        </div>
      </AccordionWrapper>
    </li>
  );
}