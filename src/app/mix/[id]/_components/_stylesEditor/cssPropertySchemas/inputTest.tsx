"use client"

import React, { useState, useMemo } from 'react';
import { cssInputTypes } from './inputTypesSchema';
import NumberInput from '../../_fragments/NumberInput';
import TextInput from '../../_fragments/TextInput';
import SelectInput from '../../_fragments/SelectInput';
import InputWrapper from '../../_fragments/InputWrapper';
import AccordionWrapper from '../../_fragments/AccordionWrapper';

export default function InputTest() {
  // State to hold values for different input types
  const [values, setValues] = useState({
    number: "0",
    unit: "px",
    dimension: "0px",
    count: "0",
    fraction: "0",
    globalKeyword: "none",
    trackKeyword: "auto",
    repeatType: "auto-fit",
    size: "{fraction}",
  });

  // Store open/closed states outside the recursive function
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  
  // Handler for updating state
  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  // Function to check if value is a reference to another input type
  const isReference = (value: string): boolean => {
    return value.startsWith('{') && value.endsWith('}');
  };

  // Function to extract reference key from value
  const extractReferenceKey = (value: string): string => {
    return value.slice(1, -1); // Remove { and }
  };

  // Handler for toggling accordion open/close state
  const toggleOpenState = (key: string) => {
    setOpenStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Recursive rendering function - using useMemo to avoid excessive re-rendering
  const renderInput = useMemo(() => {
    // Define the actual rendering function
    const render = (key: string, item: any, depth = 0): React.ReactNode => {
      // For handling nested inputs from selections
      const handleNestedSelection = (currentValue: string): React.ReactNode => {
        // If the selected value is a reference to another input type
        if (isReference(currentValue)) {
          const refKey = extractReferenceKey(currentValue);
          if (cssInputTypes[refKey]) {
            // Render the referenced input type with increased depth
            return render(refKey, cssInputTypes[refKey], depth + 1);
          }
        }
        // If not a reference or reference not found, just return the value
        return <div className="text-xs text-gray-500">{currentValue}</div>;
      };
      
      // Generate formatted output based on the input type
      const getFormattedOutput = (item: any, value: string) => {
        if (!item.format) return value;
        
        let formatted = item.format;
        
        // Replace all placeholders in the format string
        if (item.type === "number" && item.format === "{value}fr") {
          return `${value}fr`;
        }
        
        return formatted.replace("{value}", value);
      };
      
      // Impose a maximum depth to prevent infinite recursion
      if (depth > 5) {
        return <div className="text-xs text-red-500">Maximum nesting depth reached</div>;
      }
      
      return (
        <>
          {item.type === "number" && 
              <div className="flex items-center">
                <NumberInput 
                  value={values[key] || "0"}
                  onChange={(e) => handleChange(key, e.target.value)}
                  min={item.min ?? undefined}
                  max={item.max ?? undefined}
                />
                {/* Add "fr" label if it's a fraction type */}
                {key === "fraction" && <div className="ml-1 text-xs text-gray-500">fr</div>}
              </div>
          }
          {item.type === "dual" && 
              <div className="flex items-center">
                <NumberInput 
                  value={values.number || "0"}
                  onChange={(e) => handleChange('number', e.target.value)}
                  min={null}
                  max={null}
                />
                <SelectInput 
                  value={values.unit || "px"}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  options={cssInputTypes.unit.options}
                />
              </div>
          }
          {item.type === "selection" && 
            <div className="flex items-center">
              <SelectInput 
                value={values[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                options={item.options}
              >
                {/* Render nested input if value is a reference */}
                {values[key] && handleNestedSelection(values[key])}
              </SelectInput>  
            </div>
          }
        </>
      );
    };
    
    return render;
  }, [values, handleChange]); // Dependencies for useMemo

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold mb-4">CSS Input Types Test</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(cssInputTypes).map(([key, item]) => (
          <div key={key} className="border p-3 rounded">
            <h2 className="font-semibold mb-2">{key}</h2>
            <p className="text-xs text-gray-500 mb-2">Type: {item.type}</p>
            {renderInput(key, item)}
          </div>
        ))}
      </div>
    </div>
  );
}