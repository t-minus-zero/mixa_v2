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

  // CSS tree state is agnostic from the TreeContext
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
    }
  });
  
  // Separate state for selections, similar to TreeContext
  const [selectedClass, setSelectedClass] = useState('default');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Update tree using Immer for immutable updates
  const updateTree = (updateFn) => {
    setCssTree(prevTree => produce(prevTree, updateFn));
  };


  // Class operations
  const addClass = (className, addToSelected = false) => {
    // Create a new class name if none is provided
    const newClassName = className || uuidv4().substring(0, 6);
    
    updateTree(draft => {
      if (!draft.classes[newClassName]) {
        draft.classes[newClassName] = {
          name: newClassName,
          properties: [
            {
              id: uuidv4(),
              type: "display",
              value: 'flex'
            }
          ]
        };
      }
    });
    
    return newClassName; // Return the class name (useful when generating a new one)
  };

  const removeClass = (className) => {
    updateTree(draft => {
      delete draft.classes[className];
    });
    
    // Update selected class if it's the one being deleted
    if (selectedClass === className) {
      const firstAvailableClass = Object.keys(cssTree.classes)[0] || null;
      setSelectedClass(firstAvailableClass);
    }
  };

  const selectClass = (className) => {
    setSelectedClass(className);
    setSelectedProperty(null); // Clear property selection when changing class
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
    
    // Update selected property if it's the one being deleted
    if (selectedProperty && selectedProperty.id === propertyId) {
      setSelectedProperty(null);
    }
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

  const updateProperty = (idList, updates) => {
    updateTree(draft => {
      for (const className in draft.classes) {
        const propertyIndex = draft.classes[className].properties.findIndex(
          prop => prop.id === idList[0]
        );
        
        if (propertyIndex !== -1) {
          Object.assign(draft.classes[className].properties[propertyIndex], updates);
          return;
        }
      }
    });
  };

  const updatePropertyValue = (idList, value) => {
    updateTree(draft => {
      for (const className in draft.classes) {
        const propertyIndex = draft.classes[className].properties.findIndex(
          prop => prop.id === idList[0]
        );
        
        if (propertyIndex !== -1) {
          let property = draft.classes[className].properties[propertyIndex];
          updateNestedProperty(property, idList, 1, value);
          break;
        }
      }
    });
  };

  const processValue = (value) => {

    if (Array.isArray(value)) {
      return value.map(item => processValue(item));
    }

    if (isReference(value)) {
      const inputType = extractReferenceKey(value);
      const inputTypeSchema = cssSchemas.inputTypes[inputType];
      let newType = inputTypeSchema.inputType;
      if (['selection', 'list'].includes(newType)) {
        newType = inputType;
      }
      const newValue = {
        id: uuidv4(),
        type: newType,
        value: processValue(inputTypeSchema.default),
      };
      return newValue;
    }
    return value;
  }

  // Helper function to update a nested property by following an ID path
  const updateNestedProperty = (prop, ids, index, value) => {
    // If we've reached the target property, update its value
    if (index >= ids.length) {
      // Check if value is a reference before setting it
      prop.value = processValue(value);
      return;
    }
    
    // Find the nested property with the next ID
    const nextId = ids[index];
    if (Array.isArray(prop.value)) {
      const itemIndex = prop.value.findIndex(item => item.id === nextId);
      if (itemIndex !== -1) {
        updateNestedProperty(prop.value[itemIndex], ids, index + 1, value);
      }
    } else if (prop.value && typeof prop.value === 'object') {
      if (prop.value.id === nextId) {
        updateNestedProperty(prop.value, ids, index + 1, value);
      }
    } else if (index === ids.length - 1) {
      // Direct value update (non-object)
      prop.value = processValue(value);
    }
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
    formatProperty,
    // Selections
    selectedClass,
    setSelectedClass,
    selectedProperty,
    setSelectedProperty
  }), [cssTree, selectedClass, selectedProperty]);

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
