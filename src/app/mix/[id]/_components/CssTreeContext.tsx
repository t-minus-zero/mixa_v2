'use client'
import React, { createContext, useState, useContext, useMemo } from 'react';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { CssTree, CssClass, CssValueNode, CssValue } from '../_types/types';
import { cssSchema } from '../_schemas/css';
import { inputsSchema } from '../_schemas/inputs';
import { 
  generateStyleFromTree, 
  generateStyleFromClass, 
  formatStyleProperty, 
  defaultCssTree, 
  isReference, 
  extractReferenceKey, 
  processValue,
  findClassById,
  findClassByName,
  getClassIdByName
} from '../_utils/treeUtils';

// Simple CSS tree structure with classes and properties
const CssTreeContext = createContext<CssTreeContextType | undefined>(undefined);

export const CssTreeProvider = ({ children }) => {

  // CSS tree state
  const [cssTree, setCssTree] = useState<CssTree>(defaultCssTree);

  // Separate state for selections
  const [selectedClass, setSelectedClass] = useState('default');
  const [selectedProperty, setSelectedProperty] = useState<CssValueNode | null>(null);

  // Schemas definition
  const cssSchemas = {
    inputTypes: inputsSchema,
    properties: cssSchema
  }


  const updateTree = (updateFn) => {
    setCssTree(prevTree => {
      // Apply the update function to get the new tree
      const updatedTree = produce(prevTree, updateFn);
      return updatedTree;
    });
  };

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
  
  // Class operations
  const addClass = (className?: string, addToSelected = false) => {
    // Create a new class name if none is provided
    const newClassName = className || uuidv4().substring(0, 6);
    
    updateTree(draft => {
      // Check if class with this name already exists
      const existingClass = findClassByName(draft, newClassName);
      
      if (!existingClass) {
        // Create new class with ID and add to array
        const newClass: CssClass = {
          id: uuidv4().substring(0, 8),
          name: newClassName,
          properties: [
            {
              id: uuidv4().substring(0, 8),
              type: "display",
              value: 'flex'
            }
          ]
        };
        
        draft.classes.push(newClass);
      }
    });
    
    return newClassName; // Return the class name (useful when generating a new one)
  };

  // Rename a class by updating its name property
  const renameClass = (oldClassName: string, newClassName: string) => {
    const oldClass = findClassByName(cssTree, oldClassName);
    const newClassExists = findClassByName(cssTree, newClassName);
    
    if (!oldClassName || !newClassName || oldClassName === newClassName || 
        !oldClass || newClassExists) {
      return false; // Invalid input or class already exists
    }

    updateTree(draft => {
      // Find the class in the array and update its name
      const classIndex = draft.classes.findIndex((c: CssClass) => c.name === oldClassName);
      if (classIndex !== -1) {
        draft.classes[classIndex].name = newClassName;
      }
    });

    // Update selected class if it's the one being renamed
    if (selectedClass === oldClassName) {
      setSelectedClass(newClassName);
    }

    return true;
  };

  const removeClass = (className: string) => {
    updateTree(draft => {
      // Filter out the class with the given name
      draft.classes = draft.classes.filter((c: CssClass) => c.name !== className);
    });
    
    // Update selected class if it's the one being deleted
    if (selectedClass === className) {
      const firstAvailableClass = cssTree.classes[0]?.name || '';
      setSelectedClass(firstAvailableClass);
    }
  };

  const selectClass = (className: string) => {
    setSelectedClass(className || '');
    setSelectedProperty(null); // Clear property selection when changing class
  };

  // Property operations
  const addProperty = (className: string, propertyType: string) => {
    updateTree(draft => {
      // Find the class by name
      const classObj = findClassByName(draft, className);
      
      if (classObj) {
        // Get default value from schema
        const schema = cssSchemas.properties[propertyType as keyof typeof cssSchemas.properties];
        const inputTypeSchema = schema?.inputs;
        let defaultValue = inputTypeSchema?.default || '';
        
        // Create new property with ID
        const newProperty = {
          id: uuidv4(),
          type: propertyType,
          value: processValue(defaultValue),
        };
        
        classObj.properties.push(newProperty);
      }
    });
  };

  const removeProperty = (className: string, propertyId: string) => {
    updateTree(draft => {
      // Find the class by name
      const classObj = findClassByName(draft, className);
      
      if (classObj) {
        classObj.properties = classObj.properties.filter(
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
  const findPropertyById = (propertyId: string) => {
    for (const classObj of cssTree.classes) {
      for (const property of classObj.properties) {
        if (property.id === propertyId) {
          return { className: classObj.name, property };
        }
      }
    }
    return null;
  };

  const updateProperty = (idList: string[], updates: Partial<CssValueNode>) => {
    updateTree(draft => {
      for (const classObj of draft.classes) {
        const propertyIndex = classObj.properties.findIndex(
          prop => prop.id === idList[0]
        );
        
        if (propertyIndex !== -1) {
          Object.assign(classObj.properties[propertyIndex], updates);
          return;
        }
      }
    });
  };

  const updatePropertyValue = (idList: string[], value: any) => {
  
    updateTree(draft => {
      for (const classObj of draft.classes) {
        const propertyIndex = classObj.properties.findIndex(
          prop => prop.id === idList[0]
        );
        
        if (propertyIndex !== -1) {
          let property = classObj.properties[propertyIndex];
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
