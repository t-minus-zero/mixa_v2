 "use client"

import React, { useState, useEffect } from 'react';
import AccordionWrapper from './_fragments/AccordionWrapper';
import PropertyElement from './PropertyElement';
import PropertySelector from './PropertySelector';
import ConstraintSelector from './ConstraintSelector';
import InputClickAndText from './_fragments/InputClickAndText';
import { EyeIcon, EyeClosedIcon, CopyIcon, XIcon, Plus } from 'lucide-react';
import { renameClassesInTree, removeClassFromTreeElements, removeClass, renameClass, addProperty } from '../_utils/treeUtils';
import { useMixEditor } from '../_contexts/MixEditorContext';

// component for a class in the css tree
// renders a collapsible section with a class name and its properties components
interface CssClassElementProps {
  className: string;
  children?: React.ReactNode;
}

const TitleWithButtons = ({ className, onToggle, openStatus, onDelete, onChange, handleAddProperty, handleAddConstraint }) => { 
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div className="w-full px-2 py-2 flex flex-row items-center justify-start group cursor-pointer" onClick={onToggle}>
      
      {/* Renamble name */}
      <div className='flex flex-row items-center flex-grow pl-2 text-xs font-medium' >
        <div className='cursor-text' onClick={(e) => e.stopPropagation()}>
          <InputClickAndText id={className} initValue={className} updateValue={onChange} />
        </div>
      </div>

      <div className={`flex flex-row items-center justify-end ${openStatus ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
        
        <PropertySelector
          className={className}
          onAddProperty={handleAddProperty}
        />
        
        <ConstraintSelector
          className={className}
          onAddConstraint={handleAddConstraint}
        />
        
        {/* Eye toggle button */}
        <button 
          className="w-6 h-6 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
        >
          {isVisible ? <EyeIcon size={16} strokeWidth={1.5}/> : <EyeClosedIcon size={16} strokeWidth={1.5} />}
        </button>
        
        {/* Copy button - no functionality for now */}
        <button className="w-6 h-6 flex items-center justify-center">
          <CopyIcon size={16} strokeWidth={1.5}/>
        </button>
        
        {/* Delete button - with functionality */}
        <button 
          className="w-6 h-6 flex items-center justify-center hover:text-red-500"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <XIcon size={16} strokeWidth={1.5}/>
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
  
  // Handle constraint selection from ConstraintSelector (placeholder for now)
  const handleAddConstraint = (constraintType, category) => {
    console.log('Adding constraint:', constraintType, 'Category:', category);
    // TODO: Implement constraint addition logic
    
    // Expand the accordion to show the newly added constraint
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  if (!cls) {
    return (
      <div className="p-2 text-xs text-gray-500">
        No class found for {cls.name}
      </div>
    );
  }
  
  return (
    <li className={`w-full rounded-3xl overflow-hidden ${isOpen ? 'bg-white/50 border border-zinc-100' : 'bg-gray-100/50'}`}>
      <div 
        className={`relative flex flex-start rounded-lg group`}
      >
        <TitleWithButtons 
          className={cls.name}
          onToggle={() => setIsOpen(!isOpen)}
          openStatus={isOpen}
          onDelete={handleDeleteClass}
          onChange={handleUpdateClassName}
          handleAddProperty={handleAddProperty}
          handleAddConstraint={handleAddConstraint}
        />
      </div>
      <AccordionWrapper openStatus={isOpen}>
        <div className=" bg-white/50 rounded-3xl">
          {/* Properties list */}
          {cls.properties && Array.isArray(cls.properties) && cls.properties.map((property) => (
            <div key={property.id} className="">
              <PropertyElement
                classId={cls.id}
                property={property}
              />
            </div>
          ))}
        </div>
      </AccordionWrapper>
    </li>
  );
}