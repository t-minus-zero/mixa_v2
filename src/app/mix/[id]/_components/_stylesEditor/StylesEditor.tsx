"use client"

import React, { useState } from 'react';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import { cssSchema } from './schema';
import PropertySection from './PropertySection';

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
    <>
      {/* Preview pane - fixed positioned to the top left of the screen */}
      <div className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-4 max-w-[300px] max-h-[400px] overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-800">CSS Preview</h3>
          <div className="text-xs text-gray-500">{Object.keys(cssValues).length} properties</div>
        </div>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">
          {JSON.stringify(cssValues, null, 2)}
        </pre>
      </div>

      {/* Main editor interface */}
      <div className="flex flex-col gap-2">
        {groups.map(group => (
          <PropertySection
            key={group}
            label={group}
            group={group}
            properties={Object.entries(cssSchema.properties).reduce((acc, [key, def]) => {
              if (def.group === group) {
                acc[key] = {
                  ...def,
                  input: {
                    type: def.inputs.dimension ? 'dimension' : 
                          def.inputs.select ? 'select' : 
                          def.inputs.color ? 'color' : 
                          Object.keys(def.inputs)[0],
                    options: def.inputs.select?.pattern ? 
                      def.inputs.select.pattern.replace(/^\^|\(|\)\$$/g, '').split('|') : 
                      def.inputs.select?.enum,
                    pattern: def.inputs.dimension?.pattern,
                  },
                  availableStructures: Object.keys(def.structures).filter(s => def.structures[s])
                };
              }
              return acc;
            }, {} as Record<string, any>)}
            values={cssValues}
            onChange={handlePropertyChange}
          />
        ))}
      </div>
    </>
  );
}
