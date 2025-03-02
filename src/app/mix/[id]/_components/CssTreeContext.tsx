'use client'
import React, { createContext, useState, useContext, useMemo } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';

import {cssDisplaySchema} from './cssPropertySchemas/displaySchema';
import { cssInputTypes } from './cssPropertySchemas/inputTypesSchema';

// Simple CSS tree structure with classes and properties
const CssTreeContext = createContext();

export const CssTreeProvider = ({ children }) => {
  // Schemas definition
  const cssSchemas = {
    inputTypes: cssInputTypes,
    //for now we load jsut the display schema, later we will load all schemas and combine them to have a single schema for all properties
    properties: cssDisplaySchema 
  }

  // CSS utility functions
  const generateCssFromTree = (cssTree) => {
    const result = [];
    
    // For each class in the tree, generate an object with classname and css string
    Object.keys(cssTree.classes).forEach(className => {
      const cssString = generateClassCss(cssTree.classes[className], className);
      result.push({ className, cssString });
    });
    
    return result;
  }

  const generateClassCss = (classObj, className) => {
    let cssString = `.${className} {`;
    
    // Process each property in the class
    classObj.properties.forEach(propObj => {
      // Get the property schema
      const propertySchema = cssSchemas.properties[propObj.type];
      
      if (propertySchema) {
        // Format the property value using formatProperty
        const formattedValue = formatProperty(propObj.value, propObj.type);
        
        // Apply the property format from the schema
        const formattedProperty = propertySchema.format.replace('{value}', formattedValue);
        cssString += ` ${formattedProperty}`;
      }
    });
    
    cssString += ' }';
    return cssString;
  }

  const formatProperty = (value, type) => {
    // If value is primitive (string, number), return it directly
    if (typeof value !== 'object') {
      return value;
    }
    
    // If value is an array, it should be processed in the context of its parent type
    if (Array.isArray(value)) {
      // Default separator is space if no type is provided
      const separator = '';
      return value.map(item => formatProperty(item.value, item.type)).join(separator);
    }
    
    // If value is an object with type and value
    if (value.type && value.value !== undefined) {
      // Get the input type schema
      const inputTypeSchema = cssSchemas.inputTypes[value.type];
      if (!inputTypeSchema) {
        return value.value; // Fallback if no schema found
      }
      
      let formattedValue;
      
      // Handle array values using the current type's separator
      if (Array.isArray(value.value)) {
        // Get separator from current schema, default to space
        const separator = inputTypeSchema.separator || '';
        formattedValue = value.value.map(item => 
          formatProperty(item.value, item.type)
        ).join(separator);
      } else {
        formattedValue = formatProperty(value.value, value.type);
      }
      
      // Apply the format from the input type schema
      return inputTypeSchema.format.replace('{value}', formattedValue);
    }
    
    // Fallback
    return String(value);
  }

  const [cssTree, setCssTree] = useState({
    classes: {
      "default": {
        name: "default",
        properties: [
          {
            id: uuidv4(),
            type: "display",
            value: 'grid'
          },
          {
            id: uuidv4(),
            type: "gridTemplateColumns",
            value: {
              id: uuidv4(),
              type: 'globalKeyword',
              value: 'initial',
            },
          },
          {
            id: uuidv4(),
            type: "gridTemplateRows",
            value: {
              id: uuidv4(),
              type: 'trackList',
              value: [
                {
                  id: uuidv4(),
                  type: 'trackKeyword',
                  value: 'auto'
                },
                {
                  id: uuidv4(),
                  type: 'fraction',
                  value: 1
                },
                {
                  id: uuidv4(),
                  type: 'dimension',
                  value: [
                    {
                      id: uuidv4(),
                      type: 'number',
                      value: 15
                    },
                    {
                      id: uuidv4(),
                      type: 'unit',
                      value: 'px'
                    }
                  ]
                }
              ]
            }
          },
          {
            id: uuidv4(),
            type: "gridGap",
            value: {
              id: uuidv4(),
              type: 'dimension',
              value: [
                {
                  id: uuidv4(),
                  type: 'number',
                  value: 15
                },
                {
                  id: uuidv4(),
                  type: 'unit',
                  value: 'px'
                }
              ]
            }
          }
        ]
      }
    },
    selectedClass: 'default',
    selectedProperty: null
  });

  // Update tree using Immer for immutable updates
  const updateTree = (updateFn) => {
    setCssTree(prevTree => produce(prevTree, updateFn));
  };

  // Class operations
  const addClass = (className) => {
    updateTree(draft => {
      if (!draft.classes[className]) {
        draft.classes[className] = {
          name: className,
          properties: []
        };
      }
    });
  };

  const removeClass = (className) => {
    updateTree(draft => {
      delete draft.classes[className];
      if (draft.selectedClass === className) {
        draft.selectedClass = Object.keys(draft.classes)[0] || null;
      }
    });
  };

  const selectClass = (className) => {
    updateTree(draft => {
      draft.selectedClass = className;
    });
  };

  // Property operations
  const addProperty = (className, propertyType) => {
    updateTree(draft => {
      if (draft.classes[className]) {
        // Get default value from schema
        const schema = cssSchemas.properties[propertyType];
        let defaultValue = schema?.default || '';
        
        // Create new property with ID
        const newProperty = {
          id: uuidv4(),
          type: propertyType,
          value: defaultValue
        };
        
        draft.classes[className].properties.push(newProperty);
      }
    });
  };

  const removeProperty = (className, propertyId) => {
    updateTree(draft => {
      if (draft.classes[className]) {
        draft.classes[className].properties = draft.classes[className].properties.filter(
          prop => prop.id !== propertyId
        );
      }
    });
  };

  // Find property by ID in any class
  const findPropertyById = (propertyId) => {
    for (const className in cssTree.classes) {
      for (const property of cssTree.classes[className].properties) {
        if (property.id === propertyId) {
          return { className, property };
        }
      }
    }
    return null;
  };

  // Update property by ID
  const updateProperty = (propertyId, updates) => {
    updateTree(draft => {
      for (const className in draft.classes) {
        const propertyIndex = draft.classes[className].properties.findIndex(
          prop => prop.id === propertyId
        );
        
        if (propertyIndex !== -1) {
          Object.assign(draft.classes[className].properties[propertyIndex], updates);
          return;
        }
      }
    });
  };

  // Update property value by ID
  const updatePropertyValue = (propertyId, value) => {
    updateTree(draft => {
      for (const className in draft.classes) {
        const propertyIndex = draft.classes[className].properties.findIndex(
          prop => prop.id === propertyId
        );
        
        if (propertyIndex !== -1) {
          draft.classes[className].properties[propertyIndex].value = value;
          return;
        }
      }
    });
  };

  // Helper functions for references
  const isReference = (value) => {
    return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
  };

  const extractReferenceKey = (value) => {
    if (!isReference(value)) return null;
    return value.substring(1, value.length - 1);
  };

  // Generate CSS from the tree
  

  const value = useMemo(() => ({
    cssTree,
    updateTree,
    // Class operations
    addClass,
    removeClass,
    selectClass,
    // Property operations
    addProperty,
    removeProperty,
    updateProperty,
    updatePropertyValue,
    findPropertyById,
    // Reference helpers
    isReference,
    extractReferenceKey,
    // CSS generation
    generateCss: () => generateCssFromTree(cssTree),
    // Schemas
    cssSchemas,
    // Format utilities
    formatProperty
  }), [cssTree]);

  return (
    <CssTreeContext.Provider value={value}>
      {children}
    </CssTreeContext.Provider>
  );
};

export const useCssTree = () => {
  const context = useContext(CssTreeContext);
  if (!context) {
    throw new Error('useCssTree must be used within a CssTreeProvider');
  }
  return context;
};
