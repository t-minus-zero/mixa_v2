'use client'

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { produce } from 'immer';

import NumberInput from '../_fragments/NumberInput';
import TextInput from '../_fragments/TextInput';
import SelectInput from '../_fragments/SelectInput';
import ListInput from '../_fragments/ListInput';
import InputWrapper from '../_fragments/InputWrapper';
import AccordionWrapper from '../_fragments/AccordionWrapper';
import { cssInputTypes } from '../cssPropertySchemas/inputTypesSchema';
import { cssGridSchema } from '../cssPropertySchemas/gridSchema';

// Create the InputTree context
const InputTreeContext = createContext(null);

// Helper functions for handling references
const isReference = (value) => {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
};

const extractReferenceKey = (value) => {
  return value.slice(1, -1); // Remove { and }
};

// InputTreeProvider component manages the entire input tree state
export const InputTreeProvider = ({ children, initialTree = null }) => {
  // Initialize with a default tree structure or the provided initialTree
  const [tree, setTree] = useState(initialTree || {
    // Default example using gridTemplateColumns 
    [cssGridSchema.gridTemplateColumns.label]: {
      value: cssGridSchema.gridTemplateColumns.default,
      format: cssGridSchema.gridTemplateColumns.inputs.format,
      inputType: cssGridSchema.gridTemplateColumns.inputs.type,
      options: cssGridSchema.gridTemplateColumns.inputs.options,
      children: {}
    }
  });

  // Helper to update the tree in an immutable way using Immer's produce
  const updateTree = (updateFn) => {
    setTree(prevTree => produce(prevTree, updateFn));
  };

  // Function to find a node by path using dot notation (e.g., "Columns.globalKeyword")
  const findNodeByPath = (path) => {
    const keys = path.split('.');
    let current = tree;
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === 0) {
        current = current[key];
      } else {
        current = current.children?.[key];
      }
      
      if (!current) return null;
    }
    
    return current;
  };

  // Update a value at a specific path
  const updateValue = (path, value, format) => {
    updateTree(draft => {
      const keys = path.split('.');
      let current = draft;
      
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (i === keys.length - 1) {
          // Update the value of the final node
          current[key].value = value;
          if (format) current[key].format = format;
        } else if (i === 0) {
          // Navigate to the first level
          current = current[key];
        } else {
          // Navigate through children
          if (!current.children) current.children = {};
          current = current.children;
          
          if (!current[key]) {
            current[key] = { children: {} };
          }
          current = current[key];
        }
      }
    });
  };

  // Add a child node at a specific path
  const addChildNode = (parentPath, key, nodeData) => {
    updateTree(draft => {
      const keys = parentPath ? parentPath.split('.') : [];
      let current = draft;
      
      // Navigate to the parent node
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === 0) {
          current = current[key];
        } else {
          if (!current.children) current.children = {};
          current = current.children[key];
        }
        
        if (!current) return; // Parent path doesn't exist
      }
      
      // Add the child node
      if (!current.children) current.children = {};
      current.children[key] = nodeData;
    });
  };

  // Handle value changes with special processing for references
  const handleValueChange = (path, value, format) => {
    // First, update the value
    updateValue(path, value, format);
    
    // If it's a reference, add children based on the reference type
    if (isReference(value)) {
      const refKey = extractReferenceKey(value);
      const refDefinition = cssInputTypes[refKey];
      
      if (refDefinition) {
        console.log(`Processing reference: ${refKey}`, refDefinition);
        
        // Add appropriate child inputs based on the reference type
        if (refDefinition.type === 'number') {
          // For number types, add min, max, step controls if they exist
          if (refDefinition.min !== undefined) {
            addChildNode(path, 'min', {
              value: refDefinition.min,
              inputType: 'number',
              format: '{value}'
            });
          }
          
          if (refDefinition.max !== undefined) {
            addChildNode(path, 'max', {
              value: refDefinition.max,
              inputType: 'number',
              format: '{value}'
            });
          }
          
          if (refDefinition.step !== undefined) {
            addChildNode(path, 'step', {
              value: refDefinition.step,
              inputType: 'number',
              format: '{value}'
            });
          }
        } else if (refDefinition.type === 'selection' && refDefinition.options) {
          // For selection types, add an options selector
          addChildNode(path, 'options', {
            value: refDefinition.default || refDefinition.options[0],
            inputType: 'selection',
            options: refDefinition.options,
            format: refDefinition.format || '{value}'
          });
        }
      }
    }
  };

  // Context value with all the functions and state
  const contextValue = useMemo(() => ({
    tree,
    updateTree,
    updateValue,
    addChildNode,
    handleValueChange,
    findNodeByPath
  }), [tree]);

  return (
    <InputTreeContext.Provider value={contextValue}>
      {children}
    </InputTreeContext.Provider>
  );
};

// Custom hook to use the input tree context
export const useInputTree = () => {
  const context = useContext(InputTreeContext);
  if (!context) {
    throw new Error('useInputTree must be used within an InputTreeProvider');
  }
  return context;
};

// Input renderer component that uses the context
const InputRenderer = ({ path }) => {
  const { tree, handleValueChange, findNodeByPath } = useInputTree();
  const nodeData = findNodeByPath(path);
  
  if (!nodeData) return null;
  
  const { inputType, value, format, options } = nodeData;
  
  // Process options for selection inputs with references
  const processOptions = (options) => {
    if (!options) return [];
    return options.map(option => {
      if (isReference(option)) {
        return extractReferenceKey(option);
      }
      return option;
    });
  };
  
  // Render child inputs if there are any
  const renderChildren = () => {
    if (!nodeData.children) return null;
    
    return (
      <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-2">
        {Object.entries(nodeData.children).map(([childKey, _]) => {
          const childPath = `${path}.${childKey}`;
          return (
            <div key={childPath} className="mb-2">
              <label className="block text-xs font-medium mb-1">{childKey}</label>
              <InputRenderer path={childPath} />
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render the appropriate input based on type
  switch (inputType) {
    case 'number':
      return (
        <div>
          <NumberInput 
            value={value} 
            onChange={(e) => handleValueChange(path, e.target.value, format)} 
          />
          {renderChildren()}
        </div>
      );
      
    case 'text':
      return (
        <div>
          <TextInput 
            value={value} 
            onChange={(e) => handleValueChange(path, e.target.value, format)} 
          />
          {renderChildren()}
        </div>
      );
      
    case 'selection':
      return (
        <div>
          <SelectInput 
            value={value} 
            onChange={(e) => handleValueChange(path, e.target.value, format)} 
            options={processOptions(options)}
          >
            {renderChildren()}
          </SelectInput>
        </div>
      );
      
    case 'list':
      return (
        <div>
          <ListInput 
            value={value} 
            onChange={(e) => handleValueChange(path, e.target.value, format)} 
          />
          {renderChildren()}
        </div>
      );
      
    default:
      return null;
  }
};

// Main InputTree component that utilizes the provider and renderer
export default function InputTree() {
  return (
    <InputTreeProvider>
      <div className="space-y-4">
        {/* In a real application, you would map over your schema to create these */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">{cssGridSchema.gridTemplateColumns.label}</label>
          <InputRenderer path={cssGridSchema.gridTemplateColumns.label} />
        </div>
        
        {/* For debugging - show the current tree structure */}
        <details className="mt-8 p-4 border border-gray-200 rounded">
          <summary className="text-sm font-medium cursor-pointer">Debug: Current Tree State</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            <TreeStateDisplay />
          </pre>
        </details>
      </div>
    </InputTreeProvider>
  );
}

// Helper component to display the current tree state
const TreeStateDisplay = () => {
  const { tree } = useInputTree();
  return <>{JSON.stringify(tree, null, 2)}</>;
};

// Exportable tester component that can be used in other components
export const InputTreeTester = () => {
  const initialTree = {
    // Initialize with gridTemplateColumns 
    [cssGridSchema.gridTemplateColumns.label]: {
      value: cssGridSchema.gridTemplateColumns.default,
      format: cssGridSchema.gridTemplateColumns.inputs.format,
      inputType: cssGridSchema.gridTemplateColumns.inputs.type,
      options: cssGridSchema.gridTemplateColumns.inputs.options,
      children: {}
    },
    // Add gridTemplateRows
    [cssGridSchema.gridTemplateRows.label]: {
      value: cssGridSchema.gridTemplateRows.default,
      format: cssGridSchema.gridTemplateRows.inputs.format,
      inputType: cssGridSchema.gridTemplateRows.inputs.type,
      options: cssGridSchema.gridTemplateRows.inputs.options,
      children: {}
    },
    // Add gridGap
    [cssGridSchema.gridGap.label]: {
      value: cssGridSchema.gridGap.default,
      format: cssGridSchema.gridGap.inputs.format,
      inputType: cssGridSchema.gridGap.inputs.type,
      options: cssGridSchema.gridGap.inputs.options,
      children: {}
    }
  };

  // Function to get the current values formatted for CSS
  const getFormattedValues = () => {
    const { tree } = useInputTree();
    
    // Build a CSS string by formatting each property according to its format
    let cssOutput = "";
    
    Object.entries(tree).forEach(([key, data]) => {
      const nodeData = data as any;
      if (nodeData.format && nodeData.value) {
        // Replace {value} with the actual value in the format string
        const formatted = nodeData.format.replace('{value}', nodeData.value);
        cssOutput += formatted + "\n";
      }
    });
    
    return cssOutput;
  };

  return (
    <InputTreeProvider initialTree={initialTree}>
      <div className="p-4 border rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-4">Grid Properties Editor</h2>
        
        {/* Render inputs for all properties */}
        <div className="space-y-6">
          {Object.keys(initialTree).map(key => (
            <div key={key} className="p-3 border rounded">
              <label className="block text-sm font-semibold mb-2">{key}</label>
              <InputRenderer path={key} />
            </div>
          ))}
        </div>
        
        {/* Display the formatted CSS output */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">CSS Output</h3>
          <CssOutput />
        </div>
        
        {/* For debugging - show the current tree state */}
        <details className="mt-8 p-4 border border-gray-200 rounded">
          <summary className="text-sm font-medium cursor-pointer">Debug: Current Tree State</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
            <TreeStateDisplay />
          </pre>
        </details>
      </div>
    </InputTreeProvider>
  );
};

// Component to display the formatted CSS output
const CssOutput = () => {
  const { tree } = useInputTree();
  
  // Build a CSS string by formatting each property according to its format
  let cssOutput = "";
  
  Object.entries(tree).forEach(([key, data]) => {
    const nodeData = data as any;
    if (nodeData.format && nodeData.value) {
      // Replace {value} with the actual value in the format string
      const formatted = nodeData.format.replace('{value}', nodeData.value);
      cssOutput += formatted + "\n";
    }
  });
  
  return (
    <div className="p-3 bg-gray-100 rounded">
      <pre className="text-sm">{cssOutput || "No CSS generated yet"}</pre>
    </div>
  );
};