import { v4 as uuidv4 } from 'uuid';

// Default initial CSS state
export const initialCssState = {
  classes: {
    "default": {
      name: "default",
      properties: [
        {
          id: uuidv4(),
          type: "display",
          value: 'flex'
        }
      ]
    }
  }
};

// Export CSS-related interfaces for reuse throughout the application
export interface CssProperty {
  id: string;
  type: string;
  value: any;
}

export interface CssClass {
  name: string;
  properties: CssProperty[];
}

export interface CssTree {
  classes: Record<string, CssClass>;
}

/**
 * Generate CSS strings from the CSS tree
 */
export const generateCssFromTree = (cssTree: CssTree, cssSchemas: any): Array<{ className: string, cssString: string }> => {
  const result = [];
  
  // For each class in the tree, generate an object with classname and css string
  Object.keys(cssTree.classes).forEach(className => {
    const cssString = generateClassCss(cssTree.classes[className], className, cssSchemas);
    result.push({ className, cssString });
  });
  
  return result;
};

/**
 * Generate a CSS string for a specific class
 */
export const generateClassCss = (classObj: CssClass, className: string, cssSchemas: any): string => {
  let cssString = `.${className} {`;
  
  // Process each property in the class
  classObj.properties.forEach(propObj => {
    // Get the property schema
    const propertySchema = cssSchemas.properties[propObj.type];
    
    if (propertySchema) {
      // Format the property value using formatProperty
      const formattedValue = formatProperty(propObj.value, propObj.type, cssSchemas);
      
      // Apply the property format from the schema
      const formattedProperty = propertySchema.format.replace('{value}', formattedValue);
      cssString += ` ${formattedProperty}`;
    }
  });
  
  cssString += ' }';
  return cssString;
};

/**
 * Format a CSS property value based on its type
 */
export const formatProperty = (value: any, type: string, cssSchemas: any): string => {
  // If value is primitive (string, number), return it directly
  if (typeof value !== 'object') {
    return String(value);
  }
  
  // If value is an array, it should be processed in the context of its parent type
  if (Array.isArray(value)) {
    // Default separator is space if no type is provided
    const separator = '';
    return value.map(item => formatProperty(item.value, item.type, cssSchemas)).join(separator);
  }
  
  // If value is an object with type and value
  if (value.type && value.value !== undefined) {
    // Get the input type schema
    const inputTypeSchema = cssSchemas.inputTypes[value.type];
    if (!inputTypeSchema) {
      return String(value.value); // Fallback if no schema found
    }
    
    let formattedValue;
    
    // Handle array values using the current type's separator
    if (Array.isArray(value.value)) {
      // Get separator from current schema, default to space
      const separator = inputTypeSchema.separator || '';
      formattedValue = value.value.map((item: any) => 
        formatProperty(item.value, item.type, cssSchemas)
      ).join(separator);
    } else {
      formattedValue = formatProperty(value.value, value.type, cssSchemas);
    }
    
    // Apply the format from the input type schema
    return inputTypeSchema.format.replace('{value}', formattedValue);
  }
  
  // Fallback
  return String(value);
};

/**
 * Add a class to the CSS tree
 */
export const addClass = (cssTree: CssTree, className: string = uuidv4().substring(0, 6)): CssTree => {
  // Create a deep copy to avoid mutating the original
  const newCssTree = JSON.parse(JSON.stringify(cssTree));
  
  if (!newCssTree.classes[className]) {
    newCssTree.classes[className] = {
      name: className,
      properties: []
    };
  }
  
  return newCssTree;
};

/**
 * Remove a class from the CSS tree
 */
export const removeClass = (cssTree: CssTree, className: string): CssTree => {
  // Create a deep copy to avoid mutating the original
  const newCssTree = JSON.parse(JSON.stringify(cssTree));
  
  // Remove the class from the cssTree
  if (newCssTree.classes[className]) {
    delete newCssTree.classes[className];
  }
  
  return newCssTree;
};

/**
 * Update (rename) a class in the CSS tree
 */
export const updateClass = (cssTree: CssTree, className: string, newClassName: string): CssTree => {
  // Create a deep copy to avoid mutating the original
  const newCssTree = JSON.parse(JSON.stringify(cssTree));
  
  // If the class exists, rename it
  if (newCssTree.classes[className]) {
    const classObj = { ...newCssTree.classes[className] };
    classObj.name = newClassName;
    
    // Delete the old class entry and add with the new name
    delete newCssTree.classes[className];
    newCssTree.classes[newClassName] = classObj;
  }
  
  return newCssTree;
};

/**
 * Add a property to a class
 */
export const addProperty = (cssTree: CssTree, className: string, propertyType: string): CssTree => {
  // Create a deep copy to avoid mutating the original
  const newCssTree = JSON.parse(JSON.stringify(cssTree));
  
  // If the class exists, add the property
  if (newCssTree.classes[className]) {
    const newProperty = {
      id: uuidv4(),
      type: propertyType,
      value: 'initial' // Default value
    };
    
    newCssTree.classes[className].properties.push(newProperty);
  }
  
  return newCssTree;
};

/**
 * Update a property in a class
 */
export const updateProperty = (
  cssTree: CssTree,
  className: string,
  propertyId: string,
  updates: Partial<CssProperty>
): CssTree => {
  // Create a deep copy to avoid mutating the original
  const newCssTree = JSON.parse(JSON.stringify(cssTree));
  
  // Find the class and property to update
  if (newCssTree.classes[className]) {
    const propertyIndex = newCssTree.classes[className].properties.findIndex(
      prop => prop.id === propertyId
    );
    
    if (propertyIndex !== -1) {
      // Update the property with the provided changes
      newCssTree.classes[className].properties[propertyIndex] = {
        ...newCssTree.classes[className].properties[propertyIndex],
        ...updates
      };
    }
  }
  
  return newCssTree;
};

/**
 * Delete a property from a class
 */
export const deleteProperty = (cssTree: CssTree, className: string, propertyId: string): CssTree => {
  // Create a deep copy to avoid mutating the original
  const newCssTree = JSON.parse(JSON.stringify(cssTree));
  
  // Find the class and remove the property
  if (newCssTree.classes[className]) {
    newCssTree.classes[className].properties = newCssTree.classes[className].properties.filter(
      prop => prop.id !== propertyId
    );
  }
  
  return newCssTree;
};
