"use client"

import React, { useState } from 'react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import { cssSchema } from './schema';
import PropertyGroup from './PropertyGroup';

export default function StylesEditor() {
  const [cssValues, setCssValues] = useState<Record<string, string>>({});

  // Handle CSS property changes
  const handlePropertyChange = (property: string, value: string) => {
    setCssValues(prev => ({
      ...prev,
      [property]: value
    }));
  };

  // Group properties by their group
  const groups = Object.entries(cssSchema.properties).reduce((acc, [_, def]) => {
    if (!acc.includes(def.group)) {
      acc.push(def.group);
    }
    return acc;
  }, [] as string[]);

  return (
    <div className="flex flex-col gap-2">
      {groups.map(group => (
        <PropertyGroup
          key={group}
          label={group}
          group={group}
          properties={cssSchema.properties}
          values={cssValues}
          onChange={handlePropertyChange}
        />
      ))}
    </div>
  );
}
