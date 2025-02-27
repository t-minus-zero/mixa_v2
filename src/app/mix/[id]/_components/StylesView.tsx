'use client'
import React, { useState } from 'react';
import { cssSchema } from './_stylesEditor/schema';
import PropertyInput from './_stylesEditor/PropertyInput';
import { useTree } from './TreeContext';

interface StylesViewProps {
  styles: Record<string, string>;
  onStyleChange: (property: string, value: string) => void;
}

const StylesView = () => {
  const { tree, selection } = useTree();

  // Check if a subproperty should be shown based on its parent's value
  const shouldShowSubProperty = (parentValue: string, subDef: any) => {
    if (!subDef.parentProperty) return true;
    
    // Handle flex properties
    if (subDef.parentProperty === 'display') {
      if (subDef.group === 'flex') {
        return parentValue === 'flex';
      }
      if (subDef.group === 'grid') {
        return parentValue === 'grid';
      }
    }
    
    return true;
  };

  // Render all properties in a flat structure
  const renderProperties = () => {
    if (!tree?.style) return null;

    return Object.entries(cssSchema.properties).map(([property, definition]) => {
      // Skip properties that are subproperties of others
      if (definition.parentProperty) {
        return null;
      }

      const value = tree.style[property] || definition.default;

      return (
        <div key={property} className="border-b border-gray-200">
          <PropertyInput
            property={property}
            definition={definition}
            value={value}
            onChange={(newValue) => console.log(property, newValue)}
          />
          {/* Render subproperties if they exist and should be shown */}
          {Object.entries(cssSchema.properties)
            .filter(([_, subDef]) => 
              subDef.parentProperty === property && 
              shouldShowSubProperty(value, subDef)
            )
            .map(([subProperty, subDefinition]) => (
              <div key={subProperty} className="ml-4">
                <PropertyInput
                  property={subProperty}
                  definition={subDefinition}
                  value={tree.style[subProperty] || subDefinition.default}
                  onChange={(newValue) => console.log(subProperty, newValue)}
                  isSubProperty={true}
                />
              </div>
            ))}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div>
          {selection && renderProperties()}
        </div>
      </div>
    </div>
  );
}

export default StylesView;
