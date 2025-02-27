"use client"

import { useState, ChangeEvent } from 'react';
import TextInput from '../_fragments/TextInput';
import SelectInput from '../_fragments/SelectInput';
import InputWrapper from '../_fragments/InputWrapper';
import StructureSelector from './StructureSelector';
import DimensionInput from '../_fragments/DimensionInput';

type StructureType = 'single' | 'dual' | 'individual';

interface PropertyInputProps {
  // Base input props
  label?: string;
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  
  // CSS-specific props
  property?: string;
  definition?: {
    group: string;
    default: string;
    parentProperty?: string;
    inputs: Record<string, { pattern?: string; enum?: string[]; }>;
    structures: Record<string, boolean>;
  };
  isSubProperty?: boolean;
}

export default function PropertyInput({
  // Base props
  label,
  value,
  onChange,
  children,
  
  // CSS-specific props
  property,
  definition,
  isSubProperty = false
}: PropertyInputProps) {
  const [currentStructure, setCurrentStructure] = useState<StructureType>('single');

  // Initialize values based on the current structure
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (currentStructure === 'single') {
      return { all: value };
    } else if (currentStructure === 'dual') {
      return { vertical: value, horizontal: value };
    } else {
      return { top: value, right: value, bottom: value, left: value };
    }
  });

  // Handle structure change
  const handleStructureChange = (newStructure: StructureType) => {
    setCurrentStructure(newStructure);
    
    // Convert values to new structure
    if (newStructure === 'single') {
      onChange(values.all || value);
    } else if (newStructure === 'dual') {
      onChange(`${values.vertical || value} ${values.horizontal || value}`);
    } else {
      onChange(`${values.top || value} ${values.right || value} ${values.bottom || value} ${values.left || value}`);
    }
  };

  // Handle individual value changes
  const handleValueChange = (key: string, newValue: string) => {
    const newValues = { ...values, [key]: newValue };
    setValues(newValues);

    // Update the combined value based on structure
    if (currentStructure === 'single') {
      onChange(newValue);
    } else if (currentStructure === 'dual') {
      onChange(`${newValues.vertical} ${newValues.horizontal}`);
    } else {
      onChange(`${newValues.top} ${newValues.right} ${newValues.bottom} ${newValues.left}`);
    }
  };

  // Handle basic input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  // Get options from a pattern
  const getOptionsFromPattern = (pattern: string): string[] => {
    const match = pattern.match(/^\^?\((.*?)\)\$?$/);
    return match ? match[1].split('|') : [];
  };

  // Render structure selector if needed
  const renderStructureSelector = () => {
    if (isSubProperty || !definition?.structures) return null;

    const { structures } = definition;
    if (!structures.single || !structures.dual || !structures.individual) return null;

    return (
      <StructureSelector
        definition={definition}
        currentStructure={currentStructure}
        onStructureChange={handleStructureChange}
      />
    );
  };

  // Render dimension inputs based on current structure
  const renderDimensionInputs = () => {
    if (currentStructure === 'single') {
      return (
        <DimensionInput
          value={values.all || value}
          onChange={(v) => handleValueChange('all', v)}
        />
      );
    }

    if (currentStructure === 'dual') {
      return (
        <div className="grid grid-cols-2 gap-2 px-2">
          <InputWrapper label="Vertical" isSubProperty={true}>
            <DimensionInput
              value={values.vertical || value}
              onChange={(v) => handleValueChange('vertical', v)}
            />
          </InputWrapper>
          <InputWrapper label="Horizontal" isSubProperty={true}>
            <DimensionInput
              value={values.horizontal || value}
              onChange={(v) => handleValueChange('horizontal', v)}
            />
          </InputWrapper>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2 px-2">
        <InputWrapper label="Top" isSubProperty={true}>
          <DimensionInput
            value={values.top || value}
            onChange={(v) => handleValueChange('top', v)}
          />
        </InputWrapper>
        <InputWrapper label="Right" isSubProperty={true}>
          <DimensionInput
            value={values.right || value}
            onChange={(v) => handleValueChange('right', v)}
          />
        </InputWrapper>
        <InputWrapper label="Bottom" isSubProperty={true}>
          <DimensionInput
            value={values.bottom || value}
            onChange={(v) => handleValueChange('bottom', v)}
          />
        </InputWrapper>
        <InputWrapper label="Left" isSubProperty={true}>
          <DimensionInput
            value={values.left || value}
            onChange={(v) => handleValueChange('left', v)}
          />
        </InputWrapper>
      </div>
    );
  };

  // Render the appropriate input based on definition
  const renderPropertyInput = () => {
    if (!definition) {
      return children || (
        <TextInput
          value={value}
          onChange={handleInputChange}
          placeholder={`Enter ${label || 'value'}...`}
        />
      );
    }

    const { inputs } = definition;

    // Handle select inputs
    if (definition.structures.select) {
      const options = inputs.select?.enum || 
        (inputs.select?.pattern ? getOptionsFromPattern(inputs.select.pattern) : []);
      return (
        <SelectInput
          value={value}
          onChange={handleInputChange}
          options={options}
        />
      );
    }

    // Handle dimension inputs
    if (inputs.dimension) {
      return renderDimensionInputs();
    }

    // Handle color inputs
    if (inputs.color) {
      return (
        <TextInput
          value={value}
          onChange={handleInputChange}
          placeholder={`Enter ${property || label}...`}
        />
      );
    }

    // Default to text input
    return (
      <TextInput
        value={value}
        onChange={handleInputChange}
        placeholder={`Enter ${property || label}...`}
      />
    );
  };

  // Render the header and content
  const content = renderPropertyInput();
  const header = (
    <div className="flex flex-row items-center justify-between gap-4 pb-1">
      <h5 className={`text-xs ${isSubProperty ? 'text-zinc-400' : 'text-zinc-500 font-medium'}`}>
        {property || label}
      </h5>
      {renderStructureSelector()}
    </div>
  );

  // For dimension inputs with multiple values or single inputs that need a wrapper
  const needsWrapper = !definition?.inputs.dimension || currentStructure === 'single';

  if (needsWrapper) {
    return (
      <InputWrapper 
        label={property || label} 
        isSubProperty={isSubProperty}
        headerContent={renderStructureSelector()}
      >
        {content}
      </InputWrapper>
    );
  }

  // For multiple dimension inputs, just use the header and content
  return (
    <div className="w-full px-4 py-3">
      {header}
      {content}
    </div>
  );
}
