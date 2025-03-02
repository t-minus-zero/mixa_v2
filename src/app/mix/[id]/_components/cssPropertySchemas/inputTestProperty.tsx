"use client"

import React, { useState, useEffect } from 'react';
import { cssInputTypes } from './inputTypesSchema';
import { cssGridSchema } from './gridSchema';
import NumberInput from '../_fragments/NumberInput';
import TextInput from '../_fragments/TextInput';
import SelectInput from '../_fragments/SelectInput';
import ListInput from '../_fragments/ListInput';
import InputWrapper from '../_fragments/InputWrapper';
import AccordionWrapper from '../_fragments/AccordionWrapper';

// Function to check if value is a reference to another input type
const isReference = (value) => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

// Function to extract reference key from value
const extractReferenceKey = (value) => {
  return value.slice(1, -1); // Remove { and }
};

// Helper to format values according to input type definition
const formatValue = (inputType, values) => {
  const typeConfig = cssInputTypes[inputType];
  if (!typeConfig || !typeConfig.format) return '';
  
  let formatted = typeConfig.format;
  
  if (typeConfig.type === 'number') {
    formatted = formatted.replace('{value}', values.value || '0');
  } else if (typeConfig.type === 'composite') {
    formatted = formatted
      .replace('{number}', values.number || '0')
      .replace('{unit}', values.unit || 'px');
  } else if (typeConfig.type === 'selection') {
    let selectedValue = values.selected || '';
    
    // If the selected value is itself a reference, resolve it
    if (isReference(selectedValue)) {
      const refType = extractReferenceKey(selectedValue);
      selectedValue = formatValue(refType, values[refType] || {});
    }
    
    formatted = formatted.replace('{value}', selectedValue);
  } else if (typeConfig.type === 'list') {
    const items = Array.isArray(values.items) ? values.items : [];
    const formattedItems = items.map((item, index) => {
      if (isReference(item)) {
        const refType = extractReferenceKey(item);
        // Use item_index key pattern to access nested values
        return formatValue(refType, values[`item_${index}`] || {});
      }
      return item;
    });
    
    const separator = typeConfig.separator || ', ';
    formatted = formatted.replace('{values}', formattedItems.join(separator));
  } else if (typeConfig.type === 'function') {
    // Handle function types by replacing each placeholder with its formatted value
    Object.keys(values).forEach(key => {
      if (key.startsWith('item_')) return; // Skip nested item values
      
      const placeholder = `{${key}}`;
      if (formatted.includes(placeholder)) {
        let paramValue = values[key];
        
        // If the value is a reference, resolve it
        if (isReference(paramValue)) {
          const refType = extractReferenceKey(paramValue);
          paramValue = formatValue(refType, values[refType] || {});
        } 
        
        formatted = formatted.replace(placeholder, paramValue);
      }
    });
  }
  
  return formatted;
};

// Input rendering component with simpler state management
const RenderInput = ({ 
  inputType, 
  values,
  onChange 
}) => {
  const inputTypeData = cssInputTypes[inputType];
  
  if (!inputTypeData) {
    return <div className="text-xs text-red-500">Unknown input type: {inputType}</div>;
  }
  
  // Handler for value changes, formats and bubbles up changes
  const handleChange = (key, value) => {
    // Create a new values object with the updated value
    const newValues = { ...values, [key]: value };
    
    // Bubble up the change with both raw values and formatted output
    onChange(newValues, formatValue(inputType, newValues));
  };
  
  // Render based on input type
  if (inputTypeData.type === 'number') {
    return (
      <div className="flex items-center">
        <NumberInput 
          value={values.value || '0'}
          onChange={(e) => handleChange('value', e.target.value)}
          min={inputTypeData.min ?? undefined}
          max={inputTypeData.max ?? undefined}
        />
        {inputType === 'fraction' && <div className="ml-1 text-xs text-gray-500">fr</div>}
      </div>
    );
  }
  
  if (inputTypeData.type === 'composite') {
    return (
      <div className="flex items-center">
        <NumberInput 
          value={values.number || '0'}
          onChange={(e) => handleChange('number', e.target.value)}
          min={null}
          max={null}
        />
        <SelectInput 
          value={values.unit || 'px'}
          onChange={(e) => handleChange('unit', e.target.value)}
          options={cssInputTypes.unit.options}
        />
      </div>
    );
  }
  
  if (inputTypeData.type === 'selection') {
    return (
      <div className="flex flex-col">
        <SelectInput 
          value={values.selected || inputTypeData.default || ''}
          onChange={(e) => handleChange('selected', e.target.value)}
          options={inputTypeData.options}
        />
        
        {values.selected && isReference(values.selected) && (
          <div className="ml-2 mt-2 border-t border-gray-100 pt-2">
            <RenderInput
              inputType={extractReferenceKey(values.selected)}
              values={values[extractReferenceKey(values.selected)] || {}}
              onChange={(nestedValues, formattedValue) => {
                // Update the nested values
                const newValues = {
                  ...values,
                  [extractReferenceKey(values.selected)]: nestedValues
                };
                
                // Re-format and bubble up the entire change
                onChange(newValues, formatValue(inputType, newValues));
              }}
            />
          </div>
        )}
      </div>
    );
  }
  
  if (inputTypeData.type === 'list') {
    const list = Array.isArray(values.items) ? values.items : [];
    
    return (
      <div className="w-full">
        <ListInput 
          value={list}
          onChange={(newItems) => {
            // When the list changes, make sure to preserve any nested values
            // that might correspond to the items that remain in the list
            const updatedValues = { ...values, items: newItems };
            onChange(updatedValues, formatValue(inputType, updatedValues));
          }}
          options={inputTypeData.items || []}
          max={inputTypeData.max || 10}
          renderItem={(itemValue, index) => (
            <div className="p-1">
              {isReference(itemValue) ? (
                <RenderInput
                  inputType={extractReferenceKey(itemValue)}
                  values={values[`item_${index}`] || {}}
                  onChange={(itemValues, formattedValue) => {
                    // Update the item values
                    const newValues = {
                      ...values,
                      [`item_${index}`]: itemValues
                    };
                    
                    // Re-format and bubble up the entire change
                    onChange(newValues, formatValue(inputType, newValues));
                  }}
                />
              ) : (
                <div className="text-xs text-gray-700">{itemValue}</div>
              )}
            </div>
          )}
        />
      </div>
    );
  }
  
  // Default to text input
  return (
    <TextInput
      value={values.value || ''}
      onChange={(e) => handleChange('value', e.target.value)}
    />
  );
};

// CSSProperty Component - with simplified state management
const CSSProperty = ({ propertyKey, schema, onCSSChange }) => {
  // Local state for this property
  const [isOpen, setIsOpen] = useState(true);
  
  // The selected input type reference (e.g., "{fraction}", "{dimension}")
  const [selectedTypeRef, setSelectedTypeRef] = useState(schema.inputs?.default || '');
  
  // The actual input type (without { })
  const selectedInputType = isReference(selectedTypeRef) 
    ? extractReferenceKey(selectedTypeRef) 
    : '';
  
  // Values for this property's inputs, organized by input type
  const [inputValues, setInputValues] = useState({});
  
  // The final resolved CSS value
  const [resolvedValue, setResolvedValue] = useState(schema.default);
  
  // Toggle accordion
  const toggleOpen = () => setIsOpen(!isOpen);
  
  // Handle selection of different input type
  const handleTypeChange = (newTypeRef) => {
    setSelectedTypeRef(newTypeRef);
    
    // If selecting a reference type, initialize with defaults
    if (isReference(newTypeRef)) {
      const newType = extractReferenceKey(newTypeRef);
      const typeData = cssInputTypes[newType];
      
      let initialValues = {};
      
      // Initialize with appropriate structure based on input type
      if (typeData) {
        if (typeData.type === 'number') {
          initialValues = { value: typeData.default || '0' };
        } else if (typeData.type === 'composite') {
          initialValues = { number: '0', unit: 'px' };
        } else if (typeData.type === 'selection') {
          initialValues = { selected: typeData.default || '' };
        } else if (typeData.type === 'list') {
          initialValues = { items: [] };
        } else if (typeData.type === 'function') {
          // For function types, initialize with empty values for all placeholders
          const format = typeData.format || '';
          const placeholders = format.match(/\{([^}]+)\}/g) || [];
          
          placeholders.forEach(placeholder => {
            const key = placeholder.slice(1, -1); // Remove { and }
            initialValues[key] = '';
          });
        }
      }
      
      setInputValues(initialValues);
      
      // Calculate initial CSS value
      const initialCss = formatValue(newType, initialValues);
      setResolvedValue(initialCss);
      onCSSChange(propertyKey, initialCss);
    } else {
      // Reset to defaults if not selecting a type
      setInputValues({});
      setResolvedValue(schema.default);
      onCSSChange(propertyKey, schema.default);
    }
  };
  
  // Handle changes from the input component
  const handleInputChange = (newValues, formattedValue) => {
    setInputValues(newValues);
    setResolvedValue(formattedValue);
    onCSSChange(propertyKey, formattedValue);
  };
  
  // Initialize with default values
  useEffect(() => {
    if (selectedInputType && !Object.keys(inputValues).length) {
      handleTypeChange(selectedTypeRef);
    }
  }, []);
  
  return (
    <div className="border-b px-4 pb-2 rounded">
      <h2 
        className="font-medium cursor-pointer flex justify-between items-center" 
        onClick={toggleOpen}
      >
        <span className="text-sm">{schema.label}</span>
        <p className="text-xs text-gray-500 mb-2">Property: {propertyKey}</p>
      </h2>
      
      <AccordionWrapper openStatus={isOpen}>
        <InputWrapper label={propertyKey}>
          {schema.inputs && schema.inputs.options && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <SelectInput
                  value={selectedTypeRef}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  options={schema.inputs.options}
                />
              </div>
              
              {selectedInputType && (
                <div className="ml-2 mt-2 border-t border-gray-100 pt-2">
                  <RenderInput
                    inputType={selectedInputType}
                    values={inputValues}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          )}
        </InputWrapper>
      </AccordionWrapper>
    </div>
  );
};

// Main component
export default function InputTestProperty() {
  // State to track resolved CSS values for all properties
  const [cssValues, setCssValues] = useState({
    gridTemplateColumns: cssGridSchema.gridTemplateColumns.default,
    gridTemplateRows: cssGridSchema.gridTemplateRows.default,
    gridGap: cssGridSchema.gridGap.default,
  });
  
  // Update CSS for a specific property
  const updateCSSValue = (key, value) => {
    setCssValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="">
      <h1 className="text-md font-semibold mb-4">CSS Grid Properties</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(cssGridSchema).map(([key, schema]) => (
          <CSSProperty 
            key={key}
            propertyKey={key}
            schema={schema}
            onCSSChange={updateCSSValue}
          />
        ))}
      </div>
      
      {/* Preview of generated CSS */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Generated CSS:</h3>
        <pre className="whitespace-pre-wrap">
          {Object.entries(cssGridSchema).map(([key, schema]) => {
            // Get the resolved value for this property
            const resolvedValue = cssValues[key] || schema.default;
            const css = schema.format.replace('{value}', resolvedValue);
            return css + '\n';
          }).join('')}
        </pre>
      </div>
    </div>
  );
}