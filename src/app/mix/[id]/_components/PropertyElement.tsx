"use client"

import React, { useState } from 'react';
import { useCssTree } from './CssTreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputWrapper from './_fragments/InputWrapper';
import TextInput from './_fragments/TextInput';
import SelectInput from './_fragments/SelectInput';
import NumberInput from './_fragments/NumberInput';
import ListInput from './_fragments/ListInput';

// Component for property in the css tree
// Renders a collapsible section with a property name and its value editor
export default function PropertyElement({ id, property }) {
  const [open, setOpen] = useState(false);
  const { 
    formatProperty, 
    cssSchemas, 
    updatePropertyValue 
  } = useCssTree();

  // Renders the appropriate input component based on the property type and schema
  const renderPropertyInput = (idList, property) => {
    // Try to get property schema first
    console.log(property.type);
    let propertySchema = cssSchemas.properties[property.type]?.inputs || cssSchemas.inputTypes[property.type];
    
    if (propertySchema === undefined) {
        return <div className="text-xs text-red-500">Unknown type: {property.type}</div>;
    }

// Now render based on the found schema

    if( propertySchema.inputType === 'number'){
        return(
            <NumberInput 
                value={property.value} 
                onChange={(e) => {
                    updatePropertyValue(idList, e.target.value);
                }}
            />
        )
    }
    if (propertySchema.inputType === 'text'){
        return(
            <TextInput 
                value={property.value.toString()} 
                onChange={(e) => {
                    updatePropertyValue(idList, e.target.value);
                }}
            />
        )
    }
    if (propertySchema.inputType === 'selection'){
        return(
            <SelectInput 
                value={property.value.toString()} 
                onChange={(e) => {
                    updatePropertyValue(idList, e.target.value);
                }}
                options={propertySchema.options}
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
                    updatePropertyValue(idList, newValues);
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
        return <div className="text-xs text-gray-400">Complex value editor not implemented</div>;
    }
  };

  let propertySchema = cssSchemas.properties[property.type]

  return (
    <div className="w-full border-b border-gray-100 py-1">
      <div 
        className="flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-medium">{propertySchema.label}</span>
        <span className="text-xs text-gray-500">
          {property && property.value ? formatProperty(property.value, property.type) : 'No value'}
        </span>
      </div>
      
      <AccordionWrapper openStatus={open}>
        <div className="pl-4 py-2">
          {property ? (
            renderPropertyInput([property.id], property)
          ) : (
            <span className="text-xs text-gray-400">No value to edit</span>
          )}
        </div>
      </AccordionWrapper>
    </div>
  );
}
