/**
 * PropertySection Component
 * 
 * This component renders a collapsible section of CSS properties based on the provided schema.
 * It's designed to create a UI for modifying CSS properties with different input types and structures.
 * 
 * The component handles complex CSS values such as:
 * - Single values (e.g., margin: 10px)
 * - Dual values (e.g., margin: 10px 20px)
 * - Individual values (e.g., margin: 10px 20px 30px 40px)
 * - Select values (e.g., display: flex)
 * - Dimension values with units (e.g., width: 100px, 50%, etc.)
 */

import { useState } from 'react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import InputWrapper from '../_fragments/InputWrapper';
import TextInput from '../_fragments/TextInput';
import SelectInput from '../_fragments/SelectInput';
import NumberInput from '../_fragments/NumberInput';
import StructureSelector from './StructureSelector';

/**
 * Type definition for structural rendering modes
 * - 'single': Renders one input for a property (applies same value to all sides)
 * - 'dual': Renders two inputs (vertical and horizontal values)
 * - 'individual': Renders four inputs (top, right, bottom, left values)
 */
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

  /**
   * Determines if a property should be displayed based on its parent property's value
   * 
   * @param definition - The property definition from the schema
   * @returns boolean - Whether the property should be shown
   * 
   * For example:
   * - Flex properties (justify-content, align-items) are only shown when display is 'flex'
   * - Grid properties (grid-template-columns, grid-gap) are only shown when display is 'grid'
   */
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

  /**
   * Renders the appropriate input component based on the property definition in the schema
   * 
   * @param property - The CSS property name (e.g., 'margin', 'display')
   * @param definition - The property definition from the schema
   * @returns JSX.Element - The rendered input component
   * 
   * This function handles different types of inputs based on the schema:
   * - Select inputs (e.g., display: [block, inline, flex, etc.])
   * - Dimension inputs with unit selection (e.g., margin: 10px)
   * - Multi-structure dimensions (e.g., margin with single/dual/individual modes)
   * - Text inputs for properties without specific input types
   */
  const renderPropertyInput = (property: string, definition: PropertySectionProps['properties'][string]) => {
    const value = values[property] || definition.default || "";
    const [currentStructure, setCurrentStructure] = useState<StructureType>('single');
    
    /**
     * Initialize multi-values state for structural properties
     * 
     * This parses CSS shorthand values like:
     * - "10px" → { all: "10px" } (single structure)
     * - "10px 20px" → { vertical: "10px", horizontal: "20px" } (dual structure)
     * - "10px 20px 30px 40px" → { top: "10px", right: "20px", bottom: "30px", left: "40px" } (individual structure)
     */
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

    // Determine if this property supports multiple structure modes (like margin, padding)
    const hasMultipleStructures = definition.availableStructures && definition.availableStructures.length > 1;
    
    /**
     * Handles structure change between single, dual, and individual modes
     * 
     * @param newStructure - The new structure type to change to
     * 
     * When changing structure, it intelligently converts values between formats:
     * - single → dual: Uses the single value for both vertical and horizontal
     * - single → individual: Uses the single value for all four sides
     * - dual → single: Uses the vertical value or defaults to 0px
     * - dual → individual: Maps vertical to top/bottom and horizontal to left/right
     * - individual → single: Uses the top value or defaults to 0px
     * - individual → dual: Derives vertical from top and horizontal from right
     */
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
      
      // Update the main CSS value through the onChange callback
      onChange(property, newCssValue);
    };

    /**
     * Handles changes to individual values within a structure
     * 
     * @param key - The key of the value being changed (e.g., 'all', 'vertical', 'top')
     * @param newValue - The new value
     * 
     * This function:
     * 1. Updates the specific value in the multiValues state
     * 2. Generates a complete CSS value string based on the current structure
     * 3. Calls the onChange callback with the updated CSS property value
     */
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
    
    /**
     * Render select input for properties with predefined options
     * Used for properties like display, flex-direction, justify-content, etc.
     * where the schema specifies input.type as 'select' with options array
     */
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
    
    /**
     * Handle dimension inputs (like width, height, margin, padding)
     * 
     * These inputs:
     * 1. Parse the value into number and unit parts (e.g., "10px" → "10" and "px")
     * 2. Provide a number input for the value and a select input for the unit
     * 3. Support different structures (single, dual, individual) based on the schema
     */
    if (definition.input.type === 'dimension') {
      /**
       * Renders a dimension input with number and unit selection
       * 
       * @param valueKey - The key in multiValues state to modify
       * @param label - Optional label to display
       * @returns JSX.Element - The rendered dimension input
       * 
       * This parses values like "10px" into a number ("10") and unit ("px")
       * and provides UI to modify both independently
       */
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
      
      /**
       * Return the appropriate dimension input UI based on the current structure
       * - single: one input for all sides
       * - dual: two inputs for vertical/horizontal
       * - individual: four inputs for top/right/bottom/left
       */
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
    
    /**
     * Default to basic text input for properties without special handling
     * Used when no specific input type is defined in the schema
     */
    return (
      <InputWrapper label={property} key={property}>
        <TextInput
          value={value}
          onChange={(e) => onChange(property, e.target.value)}
        />
      </InputWrapper>
    );
  };

  /**
   * Renders all properties in this section that should be visible
   * Filters properties based on their parent property values
   * For example, only show flex properties when display is set to 'flex'
   */
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
