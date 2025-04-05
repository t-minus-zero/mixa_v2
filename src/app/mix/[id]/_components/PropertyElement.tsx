"use client"

import React, { useState } from 'react';
import { useMixEditor } from '../_contexts/MixEditorContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import TextInput from './_fragments/TextInput';
import SelectInput from './_fragments/SelectInput';
import NumberInput from './_fragments/NumberInput';
import ListInput from './_fragments/ListInput';
import CompositeInput from './_fragments/CompositeInput';
import { X, Copy } from 'lucide-react';
import { htmlSchemas } from '../_contexts/MixEditorContext';
import { formatStyleProperty, updatePropertyValue, removeProperty, getLabelsOfPropertyOptions } from '../_utils/treeUtils';

// Component for property in the css tree
// Renders a collapsible section with a property name and its value editor
export default function PropertyElement({ classId, property }) {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { cssTree, updateCssTree } = useMixEditor();
  const properties = htmlSchemas.properties;
  const inputTypes = htmlSchemas.inputTypes;

  // Renders the appropriate input component based on the property type and schema
  const renderPropertyInput = (idList, property) => {
    // Try to get property schema first
    console.log(property.type);
    let propertySchema = properties[property.type]?.inputs || inputTypes[property.type];
    
    if (propertySchema === undefined) {
        return <div className="text-xs text-red-500">Unknown type: {property.type}</div>;
    }

// Now render based on the found schema

    if( propertySchema.inputType === 'number'){
        return(
            <NumberInput 
                value={property.value} 
                onChange={(e) => {
                    updateCssTree(cssTree => {
                        updatePropertyValue(cssTree, idList, e.target.value);
                    });
                }}
            />
        )
    }
    if (propertySchema.inputType === 'text'){
        return(
            <TextInput 
                value={property.value.toString()} 
                onChange={(e) => {
                    updateCssTree(cssTree => {
                        updatePropertyValue(cssTree, idList, e.target.value);
                    });
                }}
            />
        )
    }
    if (propertySchema.inputType === 'composite'){
        // Get the composite parts based on the schema options
        const parts = property.value.toString().split(propertySchema.separator || '');
        
        return(
            <CompositeInput 
                value={Array.isArray(property.value) ? property.value : [property.value.toString()]} 
                onChange={(newValues) => {
                    // Direct update with the array of values
                    updateCssTree(cssTree => {
                        updatePropertyValue(cssTree, idList, newValues);
                    });
                }}
                options={propertySchema.options || []}
                renderItem={(item, index) => {
                    // Render each item based on its type
                    if (typeof item === 'object' && item !== null) {
                        return renderPropertyInput([...idList, item.id], item);
                    } else {
                        return <span className="text-xs">{item}</span>;
                    }
                }}
            />
        )
    }
    if (propertySchema.inputType === 'selection'){
        return(
            <SelectInput 
                value={property.value.toString()} 
                onChange={(e) => {
                    updateCssTree(cssTree => {
                        updatePropertyValue(cssTree, idList, e.target.value);
                    });
                }}
                options={propertySchema.options || []}
            >
                {
                    // If value is an array, render each item
                    Array.isArray(property.value) ? 
                        property.value.map(item => renderPropertyInput([...idList, item.id], item))
                    // If value is an object with type and value, render it recursively
                    : typeof property.value === 'object' && property.value !== null ?
                        renderPropertyInput([...idList, property.value.id], property.value)
                    // Otherwise just show the value as text
                    : <span className="text-xs">{property.value}</span>
                }
            </SelectInput>
        )
    }if(propertySchema.inputType === 'list'){
        return(
            <ListInput 
                value={Array.isArray(property.value) ? property.value : [property.value.toString()]} 
                onChange={(newValues) => {
                    // Direct update with the array of values
                    updateCssTree(cssTree => {
                        updatePropertyValue(cssTree, idList, newValues);
                    });
                }}
                options={propertySchema.options || []}
                renderItem={(item, index) => {
                    // Render each item based on its type
                    if (typeof item === 'object' && item !== null) {
                        return renderPropertyInput([...idList, item.id], item);
                    } else {
                        return <span className="text-xs">{item}</span>;
                    }
                }}
            />
        )
    }else{
        // Fallback for other object types
        return <div className="text-xs text-zinc-400">Complex value editor not implemented</div>;
    }
  };

  let propertySchema = properties[property.type]

  // Handle property removal
  const handleRemoveProperty = (e) => {
    e.stopPropagation(); // Prevent triggering the accordion toggle
    updateCssTree(cssTree => {
        removeProperty(cssTree, classId, property.id);
    });
  };

  return (
    <div 
      className="w-full border-b border-zinc-200/50 py-1 hover:bg-zinc-50/50 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="flex flex-row justify-between items-center cursor-pointer px-2 py-1 rounded"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-medium">{propertySchema.label}</span>
        <div className="flex items-center">
          {!isHovering && (
            <span className="text-xxs text-zinc-500 mr-2">
              {property && property.value ? formatStyleProperty(property.value, property.type) : 'No value'}
            </span>
          )}
          
          {/* Buttons that appear on hover */}
          {isHovering && (
            <div className="flex gap-2">
              <button
                className="text-zinc-700 hover:text-blue-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (property && property.value) {
                    navigator.clipboard.writeText(formatStyleProperty(property.value, property.type));
                  }
                }}
                aria-label="Copy property value"
              >
                <Copy size={12} />
              </button>
              <button
                className="text-zinc-700 hover:text-red-500 transition-colors"
                onClick={handleRemoveProperty}
                aria-label="Remove property"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <AccordionWrapper openStatus={open}>
        <div className="p-2">
          {property ? (
            renderPropertyInput([property.id], property)
          ) : (
            <span className="text-xxs text-zinc-400">No value to edit</span>
          )}
        </div>
      </AccordionWrapper>
    </div>
  );
}
