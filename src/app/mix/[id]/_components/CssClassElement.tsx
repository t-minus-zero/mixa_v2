 "use client"

import React, { useState, useEffect } from 'react';
import { useCssTree } from './CssTreeContext';
import { useTree } from './TreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import PropertyElement from './PropertyElement';
import PropertySelector from './PropertySelector';
import InputClickAndText from './_fragments/InputClickAndText';
import { EyeIcon, EyeClosedIcon, CopyIcon, XIcon } from 'lucide-react';

// component for a class in the css tree
// renders a collapsible section with a class name and its properties components
interface CssClassElementProps {
  className: string;
  children?: React.ReactNode;
}

const TitleWithButtons = ({ className, onToggle, openStatus, onDelete, onChange }) => { 
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div className="w-full px-2 py-1 flex flex-row items-center justify-start group rounded-md cursor-pointer" onClick={onToggle}>
      
      {/* Renamble name */}
      <div className='flex flex-row items-center flex-grow ' >
        <div className='cursor-text' onClick={(e) => e.stopPropagation()}>
          <InputClickAndText id={className} initValue={className} updateValue={onChange} />
        </div>
      </div>

      <div className={`flex flex-row items-center justify-end ${openStatus ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
        {/* Eye toggle button */}
        <button 
          className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:text-zinc-600"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
        >
          {isVisible ? <EyeIcon size={16} /> : <EyeClosedIcon size={16} />}
        </button>
        
        {/* Copy button - no functionality for now */}
        <button className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:text-zinc-600">
          <CopyIcon size={16} />
        </button>
        
        {/* Delete button - with functionality */}
        <button 
          className="w-6 h-6 flex items-center justify-center text-zinc-700 hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <XIcon size={16} />
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
    <li className={`w-full rounded-lg  border ${isOpen ? 'border-blue-400 bg-blue-50/50' : 'border-zinc-100 bg-zinc-100/50'}`}>
      <div 
        className={`relative flex flex-start group ${isOpen ? 'bg-blue-100/50' : 'bg-transparent'}`}
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