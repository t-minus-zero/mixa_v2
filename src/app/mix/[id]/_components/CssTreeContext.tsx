'use client'
import React, { createContext, useState, useContext, useMemo } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';

import { CssTree, CssClass, CssValueNode, CssValue } from '../_types/types';
import { cssSchema } from '../_schemas/css';
import { inputsSchema } from '../_schemas/inputs';
import { generateStyleFromTree, generateStyleFromClass, formatStyleProperty, defaultCssTree, isReference, extractReferenceKey, processValue } from '../_utils/treeUtils';

// Simple CSS tree structure with classes and properties
const CssTreeContext = createContext();

export const CssTreeProvider = ({ children }) => {

  // CSS tree state
  const [cssTree, setCssTree] = useState<CssTree>(defaultCssTree);

  // Separate state for selections
  const [selectedClass, setSelectedClass] = useState('default');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Schemas definition
  const cssSchemas = {
    inputTypes: inputsSchema,
    properties: cssSchema
  }

  // converted
  const generateCssFromTree = (cssTree: CssTree) => {
    return generateStyleFromTree(cssTree);
  };
  // converted
  const generateClassCss = (classObj: CssClass, className: string) => {
    return generateStyleFromClass(classObj, className);
  }

  // converted
  const formatProperty = (value: CssValue, type: string) => {
    return formatStyleProperty(value, type);
  }

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

  // (remember to refractor when we switch to IDs for classes instead of names)
  const renameClass = (oldClassName, newClassName) => {
    if (!oldClassName || !newClassName || oldClassName === newClassName || 
        !cssTree.classes[oldClassName] || cssTree.classes[newClassName]) {
      return false; // Invalid input or class already exists
    }

    updateTree(draft => {
      // Create new class with the new name but same properties
      draft.classes[newClassName] = {
        ...draft.classes[oldClassName],
        name: newClassName
      };
      
      // Delete the old class
      delete draft.classes[oldClassName];
    });

    // Update selected class if it's the one being renamed
    if (selectedClass === oldClassName) {
      setSelectedClass(newClassName);
    }

    return true;
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
        const inputTypeSchema = schema.inputs;
        let defaultValue = inputTypeSchema?.default || '';
        
        // Create new property with ID
        const newProperty = {
          id: uuidv4(),
          type: propertyType,
          value: processValue(defaultValue),
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

  // Generate CSS from the tree
  

  const value = useMemo(() => ({
    cssTree,
    updateTree,
    // Class operations
    addClass,
    renameClass,
    removeClass,
    selectClass,
    // Property operations
    addProperty,
    removeProperty,
    updateProperty,
    updatePropertyValue,
    findPropertyById,
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
