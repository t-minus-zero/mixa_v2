"use client"

import React, { useState, useRef } from 'react';
import { useMixEditor } from '../_contexts/MixEditorContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import TextInput from './_fragments/TextInput';
import SelectInput from './_fragments/SelectInput';
import NumberInput from './_fragments/NumberInput';
import ListInput from './_fragments/ListInput';
import OptionSelector from './_fragments/OptionSelector';
import CompositeInput from './_fragments/CompositeInput';
import { X, Copy, EllipsisVertical, Shapes, ChevronsUpDown, Hexagon, GitCompare } from 'lucide-react';
import { htmlSchemas } from '../_contexts/MixEditorContext';
import { formatStyleProperty, updatePropertyValue, removeProperty, getLabelsOfPropertyOptions } from '../_utils/treeUtils';
import Portal from 'MixaDev/app/_components/portal/Portal';

// Component for property in the css tree
// Renders a collapsible section with a property name and its value editor
export default function PropertyElement({ classId, property }) {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { cssTree, updateCssTree, rightFloaterRef } = useMixEditor();
  const properties = htmlSchemas.properties;
  const inputTypes = htmlSchemas.inputTypes;
  const [renderedOutput, setRenderedOutput] = useState(null);

  let result = null;
  let complexPropertyValue = null;

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
                      : <span className="text-xs text-nowrap">{property.value}</span>
                  }
              </SelectInput>
          )
      }if( propertySchema.inputType === 'option'){
        const isList = property.value.type === 'trackList'
        const isString = typeof property.value === 'string'
        const depth = idList.length;
        if (isList) {
          result = renderPropertyInput([...idList, property.value.id], property.value);
          complexPropertyValue = formatStyleProperty(property.value, property.type);
        }
        
        return(
          <div className={`flex rounded-3xl group ${isList ? 'flex-row items-center' : 'flex-row items-center'} ${depth === 1 || !isString ? 'bg-gray-100' : ''}`}>
            <div className={'flex justify-center items-center' + (isList ? ' w-full' : 'w-full')}>
              <OptionSelector 
                  onChange={(id) => {
                      updateCssTree(cssTree => {
                          updatePropertyValue(cssTree, idList, id);
                      });
                  }}
                  options={propertySchema.options || []}
              >
                {/* Check if value is a string */}
                {typeof property.value === 'string' ? (
                  <div className={'flex flex-row gap-0.5 items-center ' + (depth === 1 ? ' py-2 px-3' : 'py-2 px-1')}>
                    <span className="text-xs">{property.value}</span>
                    <ChevronsUpDown size={10} className="text-gray-500" />
                  </div>  
                ) : (
                  <div className={'transition-all duration-300 w-0 rounded-lg overflow-hidden group-hover:w-6'}>
                    <div className="w-6 flex items-center justify-center"><GitCompare size={14} className="text-zinc-700" /></div>
                  </div>
                )}
              </OptionSelector>
            </div>
              {!isList &&
                  // If value is an object with type and value, render it recursively
                  typeof property.value === 'object' && property.value !== null &&
                      renderPropertyInput([...idList, property.value.id], property.value)
              }
          </div>
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
                          return <span className="text-xs text-nowrap w-full">{item}</span>;
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
      className="w-full overflow-hidden rounded-3xl relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="w-full flex flex-row items-center justify-between cursor-pointer px-2 py-1 rounded"
      >

        <div className="flex flex-row items-center h-full justify-start gap-1">
          <button
              className="text-zinc-700 w-2 hover:bg-gray-100/50 transition-colors"
              onClick={()=>{console.log('Open options')}}
              aria-label="Open options"
            >
            {isHovering &&<EllipsisVertical size={12} />}
          </button> 
          <span className="text-xxs font-semibold text-gray-700 uppercase">{propertySchema?.label || property.type}</span>
        </div>

        <div className="flex flex-row justify-end">
          <div className="flex items-center rounded-lg overflow-hidden">
            {property.value ? (
              renderPropertyInput([property.id], property)
            ) : (
              <span className="text-xxs text-zinc-400">No value to edit</span>
            )}
            {complexPropertyValue && (
              <div className="px-3 py-2 flex items-center justify-center bg-gray-100 rounded-3xl" onClick={() => setOpen(!open)}>
                <span className="text-xs text-gray-900">
                  {complexPropertyValue}
                </span>
              </div>
            )}
          </div>

        </div>

      </div>
      {result !== null && 
        <Portal
          show={open}
          onClickOutside={() => {
            setOpen(false);
          }}
          anchorEl={rightFloaterRef}
          placement="left"
          offset={5}
          autoAdjust={true}
          maxHeight={300}
          className="bg-zinc-50/75 backdrop-blur-md rounded-xl shadow-lg border border-zinc-200 w-56 overflow-hidden"
          zIndex={1000}
        >
          <div className="flex flex-col h-full">
            {result}
          </div>
        </Portal>
      }
    </div>
  );
}
