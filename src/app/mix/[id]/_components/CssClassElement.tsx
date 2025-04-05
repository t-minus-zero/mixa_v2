 "use client"

import React, { useState, useEffect } from 'react';
import AccordionWrapper from './_fragments/AccordionWrapper';
import PropertyElement from './PropertyElement';
import PropertySelector from './PropertySelector';
import InputClickAndText from './_fragments/InputClickAndText';
import { EyeIcon, EyeClosedIcon, CopyIcon, XIcon } from 'lucide-react';
import { renameClassesInTree, removeClassFromTreeElements, removeClass, renameClass, addProperty } from '../_utils/treeUtils';
import { useMixEditor } from '../_contexts/MixEditorContext';

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

export default function CssClassElement({ cls }) {
  
  const { 
    tree,
    updateTree,
    selection,
    cssTree,
    updateCssTree
  } = useMixEditor();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle updating class name (remember to refractor when we switch to IDs for classes instead of names)
  const handleUpdateClassName = (newClassName: string) => {
    if (newClassName !== cls.name && newClassName.trim()) {

      updateCssTree(cssTree => {
        renameClass(cssTree, cls.id, cls.name, newClassName);
      });
    }
  };
  
  // Handle deleting class
  const handleDeleteClass = () => {
    
    // Remove class from all tree elements
    updateTree(tree => {
      removeClassFromTreeElements(tree, cls.id);
    });

    // Remove class from CssTree
    updateCssTree(cssTree => {
      removeClass(cssTree, cls.id);
    });
  };
  
  // Handle property selection from PropertySelector
  const handleAddProperty = (propertyType) => {
    // Add the property to the class
    updateCssTree(cssTree => {
      addProperty(cssTree, cls.id, propertyType);
    });
    
    // Expand the accordion to show the newly added property
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  if (!cls) {
    return (
      <div className="p-2 text-sm text-gray-500">
        No class found for {cls.name}
      </div>
    );
  }
  
  return (
    <li className={`w-full rounded-lg  border ${isOpen ? 'border-blue-400 bg-blue-50/50' : 'border-zinc-100 bg-zinc-100/50'}`}>
      <div 
        className={`relative flex flex-start group ${isOpen ? 'bg-blue-100/50' : 'bg-transparent'}`}
      >
        <TitleWithButtons 
          className={cls.name}
          onToggle={() => setIsOpen(!isOpen)}
          openStatus={isOpen}
          onDelete={handleDeleteClass}
          onChange={handleUpdateClassName}
        />
      </div>
      <AccordionWrapper openStatus={isOpen}>
        <div className="border-t border-zinc-200">
          {/* Properties list */}
          {cls.properties && Array.isArray(cls.properties) && cls.properties.map((property) => (
            <div key={property.id} className="">
              <PropertyElement
                classId={cls.id}
                property={property}
              />
            </div>
          ))}
          
          {/* Property selector */}
          <PropertySelector
            className={cls.name}
            onAddProperty={handleAddProperty}
          />
        </div>
      </AccordionWrapper>
    </li>
  );
}