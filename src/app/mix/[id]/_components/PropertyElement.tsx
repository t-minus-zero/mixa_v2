"use client"

import React, { useState } from 'react';
import { useCssTree } from './CssTreeContext';
import AccordionWrapper from './_fragments/AccordionWrapper';
import InputWrapper from './_fragments/InputWrapper';
import TextInput from './_fragments/TextInput';
import SelectInput from './_fragments/SelectInput';
import NumberInput from './_fragments/NumberInput';

// Component for property in the css tree
// Renders a collapsible section with a property name and its value editor
export default function PropertyElement({ id, label, properties, values, propertyType }) {
  const [open, setOpen] = useState(false);
  const { 
    formatProperty, 
    cssSchemas, 
    updatePropertyValue 
  } = useCssTree();

  // Get property schema based on propertyType
  const propertySchema = cssSchemas.properties[propertyType];

  // Renders the appropriate input component based on the property type and schema
  const renderPropertyInput = (value, path = '') => {
    // If no value or property schema, show an error
    if (!value || !propertySchema) {
      return <div className="text-xs text-red-500">Missing property schema for {propertyType}</div>;
    }

    // If value is primitive (string/number), render a simple input
    if (typeof value !== 'object') {
      return (
        <TextInput 
          value={value.toString()} 
          onChange={(e) => {
            updatePropertyValue(id, e.target.value);
          }}
        />
      );
    }

    // If value is an array, render inputs for each item
    if (Array.isArray(value)) {
      return (
        <div className="flex flex-col gap-1">
          {value.map((item, index) => (
            <div key={item.id || index} className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{item.type || index}:</span>
              {renderPropertyInput(item.value, `${path}[${index}]`)}
            </div>
          ))}
        </div>
      );
    }

    // If value is an object with type and value
    if (value.type && value.value !== undefined) {
      // First, check property-specific input schema
      const propertyInputSchema = propertySchema?.inputs;
      
      // Then, get general input type schema as fallback
      const inputTypeSchema = cssSchemas.inputTypes[value.type];

      // Determine which input schema to use
      const activeSchema = propertyInputSchema || inputTypeSchema;

      if (!activeSchema) {
        return <div className="text-xs text-red-500">Unknown type: {value.type}</div>;
      }

      // Determine which input component to use based on inputType in schema
      switch (activeSchema.inputType) {
        case 'number':
          return (
            <NumberInput 
              value={value.value.toString()}
              onChange={(e) => {
                // Create a new object with the updated value
                const newValueObj = { ...value, value: e.target.value };
                updatePropertyValue(id, newValueObj);
              }}
              min={activeSchema.min || undefined}
              max={activeSchema.max || undefined}
            />
          );

        case 'selection':
          // Special handling for property-specific options
          const options = activeSchema.options || [];
          // Filter options that might be references to other types
          const resolvedOptions = options.filter(opt => 
            !opt.startsWith('{') || opt.startsWith('{') && opt.endsWith('}') && cssSchemas.inputTypes[opt.slice(1, -1)]
          );
          
          return (
            <SelectInput 
              value={value.value.toString()}
              options={resolvedOptions}
              onChange={(e) => {
                // Create a new object with the updated value
                const newValueObj = { ...value, value: e.target.value };
                updatePropertyValue(id, newValueObj);
              }}
            />
          );

        case 'list':
          if (Array.isArray(value.value)) {
            return renderPropertyInput(value.value, `${path}.value`);
          }
          return <div className="text-xs">List editor not fully implemented</div>;

        case 'composite':
          return <div className="text-xs">Composite editor not implemented</div>;

        case 'function':
          return <div className="text-xs">Function editor not implemented</div>;

        // Default to text input for any other types
        default:
          return (
            <TextInput 
              value={value.value.toString()} 
              onChange={(e) => {
                const newValueObj = { ...value, value: e.target.value };
                updatePropertyValue(id, newValueObj);
              }}
            />
          );
      }
    }

    // Fallback for other object types
    return <div className="text-xs text-gray-400">Complex value editor not implemented</div>;
  };

  return (
    <div className="w-full border-b border-gray-100 py-1">
      <div 
        className="flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs text-gray-500">
          {properties && properties.value ? formatProperty(properties.value, properties.type) : 'No value'}
        </span>
      </div>
      
      <AccordionWrapper openStatus={open}>
        <div className="pl-4 py-2">
          {properties && properties.value ? (
            renderPropertyInput(properties.value)
          ) : (
            <span className="text-xs text-gray-400">No value to edit</span>
          )}
        </div>
      </AccordionWrapper>
    </div>
  );
}
