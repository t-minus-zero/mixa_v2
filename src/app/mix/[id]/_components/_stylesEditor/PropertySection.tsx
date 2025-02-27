"use client"

import { useState } from 'react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import InputWrapper from '../_fragments/InputWrapper';
import TextInput from '../_fragments/TextInput';
import SelectInput from '../_fragments/SelectInput';
import NumberInput from '../_fragments/NumberInput';
import StructureSelector from './StructureSelector';

type StructureType = 'single' | 'dual' | 'individual';

interface PropertySectionProps {
  label: string;
  group?: string;
  properties?: Record<string, {
    group: string;
    default: string;
    parentProperty?: string;
    input: {
      type?: string;
      options?: string[];
      pattern?: string;
    };
    availableStructures?: string[];
  }>;
  values?: Record<string, string>;
  onChange?: (property: string, value: string) => void;
}

export default function PropertySection({
  label,
  group,
  properties = {},
  values = {},
  onChange = () => {}
}: PropertySectionProps) {
  const [open, setOpen] = useState(false);

  // Check if a property should be shown based on its parent
  const shouldShowProperty = (definition: PropertySectionProps['properties'][string]): boolean => {
    if (!definition?.parentProperty) return true;

    const parentValue = values[definition.parentProperty];

    if (definition.group === 'flex') {
      return parentValue === 'flex';
    }
    if (definition.group === 'grid') {
      return parentValue === 'grid';
    }

    return true;
  };

  // Render a property input based on its type
  const renderPropertyInput = (property: string, definition: PropertySectionProps['properties'][string]) => {
    const value = values[property] || definition.default || "";
    const [currentStructure, setCurrentStructure] = useState<StructureType>('single');
    
    // Initialize multi-value state
    const [multiValues, setMultiValues] = useState<Record<string, string>>(() => {
      // Parse value into individual parts based on spaces
      const parts = value.split(/\s+/);
      
      if (parts.length === 1) {
        return { all: parts[0] || "0px" };
      } else if (parts.length === 2) {
        return { 
          vertical: parts[0] || "0px", 
          horizontal: parts[1] || "0px" 
        };
      } else if (parts.length >= 4) {
        return { 
          top: parts[0] || "0px", 
          right: parts[1] || "0px", 
          bottom: parts[2] || "0px", 
          left: parts[3] || "0px" 
        };
      } else {
        return { all: parts[0] || "0px" };
      }
    });

    // For structural properties (like margin, padding), handle structure change
    const hasMultipleStructures = definition.availableStructures && definition.availableStructures.length > 1;
    
    // Handle structure change
    const handleStructureChange = (newStructure: StructureType) => {
      setCurrentStructure(newStructure);
      
      // Convert values to the new structure
      let newCssValue: string;
      
      if (newStructure === 'single') {
        // Use the 'all' value or first value from previous structure
        const singleValue = multiValues.all || multiValues.vertical || multiValues.top || "0px";
        setMultiValues({ all: singleValue });
        newCssValue = singleValue;
      } 
      else if (newStructure === 'dual') {
        // Use vertical and horizontal values or derive from previous structure
        const vertical = multiValues.vertical || multiValues.top || multiValues.all || "0px";
        const horizontal = multiValues.horizontal || multiValues.right || multiValues.all || "0px";
        setMultiValues({ vertical, horizontal });
        newCssValue = `${vertical} ${horizontal}`;
      } 
      else if (newStructure === 'individual') {
        // Use all four sides or derive from previous structure
        const top = multiValues.top || multiValues.vertical || multiValues.all || "0px";
        const right = multiValues.right || multiValues.horizontal || multiValues.all || "0px";
        const bottom = multiValues.bottom || multiValues.vertical || multiValues.all || "0px";
        const left = multiValues.left || multiValues.horizontal || multiValues.all || "0px";
        setMultiValues({ top, right, bottom, left });
        newCssValue = `${top} ${right} ${bottom} ${left}`;
      }
      else {
        // Fallback
        newCssValue = value;
      }
      
      // Update the main CSS value
      onChange(property, newCssValue);
    };

    // Handle individual value changes within a structure
    const handleMultiValueChange = (key: string, newValue: string) => {
      // Update the specific value
      const updatedValues = { ...multiValues, [key]: newValue };
      setMultiValues(updatedValues);
      
      // Generate the complete CSS value based on current structure
      let newCssValue: string;
      
      if (currentStructure === 'single') {
        newCssValue = updatedValues.all;
      } 
      else if (currentStructure === 'dual') {
        newCssValue = `${updatedValues.vertical} ${updatedValues.horizontal}`;
      } 
      else {
        newCssValue = `${updatedValues.top} ${updatedValues.right} ${updatedValues.bottom} ${updatedValues.left}`;
      }
      
      // Update the main CSS value
      onChange(property, newCssValue);
    };
    
    // Determine what type of input to show
    if (definition.input.type === 'select') {
      return (
        <InputWrapper label={property} key={property}>
          <SelectInput
            value={value}
            onChange={(e) => onChange(property, e.target.value)}
            options={definition.input.options || []}
          />
        </InputWrapper>
      );
    }
    
    // For dimension inputs, parse into number and unit
    if (definition.input.type === 'dimension') {
      // Render dimension input based on current structure
      const renderDimensionInput = (valueKey: string, label?: string) => {
        const dimensionValue = multiValues[valueKey] || "0px";
        const match = dimensionValue.match(/^(-?\d*\.?\d+)(px|%|rem|em|vh|vw|fr)$/);
        const numValue = match?.[1] || "0";
        const unit = match?.[2] || "px";
        
        return (
          <InputWrapper label={label} key={valueKey}>
            <div className="flex items-center">
              <NumberInput
                value={numValue}
                onChange={(e) => {
                  const newValue = `${e.target.value}${unit}`;
                  handleMultiValueChange(valueKey, newValue);
                }}
              />
              <SelectInput
                value={unit}
                onChange={(e) => {
                  const newValue = `${numValue}${e.target.value}`;
                  handleMultiValueChange(valueKey, newValue);
                }}
                options={['px', '%', 'rem', 'em', 'vh', 'vw', 'fr']}
              />
            </div>
          </InputWrapper>
        );
      };
      
      // Return appropriate inputs based on current structure
      return (
        <div className="w-full" key={property}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-zinc-500 font-medium">{property}</div>
            {hasMultipleStructures && (
              <StructureSelector
                availableStructures={definition.availableStructures || []}
                currentStructure={currentStructure}
                onStructureChange={handleStructureChange}
              />
            )}
          </div>
          
          {currentStructure === 'single' && (
            renderDimensionInput('all')
          )}
          
          {currentStructure === 'dual' && (
            <div className="grid grid-cols-2 gap-2">
              {renderDimensionInput('vertical', 'Vertical')}
              {renderDimensionInput('horizontal', 'Horizontal')}
            </div>
          )}
          
          {currentStructure === 'individual' && (
            <div className="grid grid-cols-2 gap-2">
              {renderDimensionInput('top', 'Top')}
              {renderDimensionInput('right', 'Right')}
              {renderDimensionInput('bottom', 'Bottom')}
              {renderDimensionInput('left', 'Left')}
            </div>
          )}
        </div>
      );
    }
    
    // Default to text input
    return (
      <InputWrapper label={property} key={property}>
        <TextInput
          value={value}
          onChange={(e) => onChange(property, e.target.value)}
        />
      </InputWrapper>
    );
  };

  // Render all properties in this section
  const renderProperties = () => {
    return Object.entries(properties)
      .filter(([_, def]) => shouldShowProperty(def))
      .map(([property, definition]) => (
        renderPropertyInput(property, definition)
      ));
  };

  return (
    <div className="py-3 px-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 
            className="text-sm text-zinc-800 font-medium cursor-pointer"   
            onClick={() => setOpen(!open)}
          > 
            {label} 
          </h3>
        </div>
      </div>
      <AccordionWrapper openStatus={open}>
        <div className="flex flex-col gap-3 mt-3">
          {renderProperties()}
        </div>
      </AccordionWrapper>
    </div>
  );
}
