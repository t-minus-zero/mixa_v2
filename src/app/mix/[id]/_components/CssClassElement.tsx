 "use client"

import React, { useState, useEffect } from 'react';
import { useCssTree } from './CssTreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputClickAndText from './_fragments/InputClickAndText';
import PropertyElement from './PropertyElement';

// component for a class in the css tree
// renders a collapsible section with a class name and its properties components
interface CssClassElementProps {
  className: string;
  children?: React.ReactNode;
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
  } = useCssTree();
  
  const [isOpen, setIsOpen] = useState(true);
  
  // Get the class object from the context using className
  const classObj = cssTree.classes[className];
  
  // Handle updating class name
  const handleUpdateClassName = (newClassName) => {
    if (newClassName !== className && newClassName.trim()) {
      // If we implement renaming classes, would call a context function here
      console.log("Would rename class from", className, "to", newClassName);
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
    <li className="w-full">
      <div 
        className="tracking-tight relative p-1 group w-full h-full flex flex-row items-center justify-start rounded-lg gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <InputClickAndText 
          id={className} 
          initValue={className} 
          updateValue={handleUpdateClassName} 
        />
      </div>
      <AccordionWrapper openStatus={isOpen}>
        <div className="pl-4">
          {/* Properties list */}
          {classObj.properties && Array.isArray(classObj.properties) && classObj.properties.map((property) => (
            <div key={property.id} className="py-1">
              <PropertyElement
                id={property.id}
                property={property}
              />
            </div>
          ))}
          
          {/* If there are no properties, show a message */}
          {(!classObj.properties || !Array.isArray(classObj.properties) || classObj.properties.length === 0) && (
            <div className="py-2 text-sm text-gray-500 italic">
              No properties
            </div>
          )}
          
          {/* Children (might be additional controls or information) */}
          {children}
        </div>
      </AccordionWrapper>
    </li>
  );
}