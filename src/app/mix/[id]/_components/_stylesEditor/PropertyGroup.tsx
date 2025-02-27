"use client"

import { useState } from 'react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import CSSPropertyInput from './CSSPropertyInput';

interface PropertyGroupProps {
  // Base props from PropertyContainer
  label: string;
  children?: React.ReactNode;
  headerContent?: React.ReactNode;
  
  // CSS-specific props from CSSPropertyGroup
  group?: string;
  properties?: Record<string, {
    group: string;
    default: string;
    parentProperty?: string;
    inputs: Record<string, { pattern?: string; enum?: string[]; }>;
    structures: Record<string, boolean>;
  }>;
  values?: Record<string, string>;
  onChange?: (property: string, value: string) => void;
}

export default function PropertyGroup({
  // Base props
  label,
  children,
  headerContent,
  
  // CSS-specific props
  group,
  properties,
  values = {},
  onChange = () => {}
}: PropertyGroupProps) {
  const [open, setOpen] = useState(false);

  // Check if a property should be shown based on its parent property
  const shouldShowProperty = (definition: PropertyGroupProps['properties'][string]): boolean => {
    if (!definition?.parentProperty) return true;

    const parentValue = values[definition.parentProperty];

    // For flex properties, show if display is flex
    if (definition.group === 'flex') {
      return parentValue === 'flex';
    }

    // For grid properties, show if display is grid
    if (definition.group === 'grid') {
      return parentValue === 'grid';
    }

    return true;
  };

  // Render CSS properties if this is being used as a CSS property group
  const renderCSSProperties = () => {
    if (!properties || !group) return null;

    // Filter properties that belong to this group
    const groupProperties = Object.entries(properties).filter(
      ([_, def]) => def.group === group
    );

    if (groupProperties.length === 0) return null;

    return groupProperties
      .filter(([_, def]) => shouldShowProperty(def))
      .map(([property, definition]) => (
        <CSSPropertyInput
          key={property}
          property={property}
          definition={definition}
          value={values[property] || definition.default}
          onChange={(value) => onChange(property, value)}
        />
      ));
  };

  return (
    <div className="py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 
            className="text-sm text-zinc-800 font-medium cursor-pointer"   
            onClick={() => setOpen(!open)}
          > 
            {label} 
          </h3>
          {headerContent}
        </div>
      </div>
      <AccordionWrapper openStatus={open}>
        <div className="flex flex-row items-center gap-2 flex-wrap mt-2">
          {renderCSSProperties() || children}
        </div>
      </AccordionWrapper>
    </div>
  );
}
