// Schema for CSS pseudo-classes and pseudo-elements
export const pseudoClassesSchema = {
  // Interactive pseudo-classes
  hover: {
    label: 'hover',
    type: 'pseudo-class',
    description: 'Applies when element is hovered over',
    target: ['class', 'id'],
    inputs: {}
  },
  
  active: {
    label: 'active',
    type: 'pseudo-class', 
    description: 'Applies when element is being activated (clicked)',
    target: ['class', 'id'],
    inputs: {}
  },
  
  focus: {
    label: 'focus',
    type: 'pseudo-class',
    description: 'Applies when element has focus',
    target: ['class', 'id'],
    inputs: {}
  },
  
  'focus-visible': {
    label: 'focus-visible',
    type: 'pseudo-class',
    description: 'Applies when element has focus and should show focus indicator',
    target: ['class', 'id'],
    inputs: {}
  },
  
  visited: {
    label: 'visited',
    type: 'pseudo-class',
    description: 'Applies to visited links',
    target: [],
    inputs: {}
  },
  
  // Structural pseudo-classes
  'first-child': {
    label: 'first-child',
    type: 'pseudo-class',
    description: 'Selects the first child element',
    target: [],
    inputs: {}
  },
  
  'last-child': {
    label: 'last-child',
    type: 'pseudo-class',
    description: 'Selects the last child element',
    target: [],
    inputs: {}
  },
  
  'nth-child': {
    label: 'nth-child',
    type: 'pseudo-class',
    description: 'Selects nth child element based on formula',
    target: [],
    inputs: {'nth-formula': 'Formula like "2n+1", "odd", "even", or a number'}
  },
  
  'nth-of-type': {
    label: 'nth-of-type',
    type: 'pseudo-class',
    description: 'Selects nth element of its type',
    target: [],
    inputs: {'nth-formula': 'Formula like "2n+1", "odd", "even", or a number'}
  },
  
  'first-of-type': {
    label: 'first-of-type',
    type: 'pseudo-class',
    description: 'Selects the first element of its type',
    target: [],
    inputs: {}
  },
  
  'last-of-type': {
    label: 'last-of-type',
    type: 'pseudo-class',
    description: 'Selects the last element of its type',
    target: [],
    inputs: {}
  },
  
  // Form-related pseudo-classes
  checked: {
    label: 'checked',
    type: 'pseudo-class',
    description: 'Applies to checked input elements',
    target: [],
    inputs: {}
  },
  
  disabled: {
    label: 'disabled',
    type: 'pseudo-class',
    description: 'Applies to disabled form elements',
    target: [],
    inputs: {}
  },
  
  enabled: {
    label: 'enabled',
    type: 'pseudo-class',
    description: 'Applies to enabled form elements',
    target: [],
    inputs: {}
  },
  
  // Pseudo-elements
  before: {
    label: 'before',
    type: 'pseudo-element',
    description: 'Creates a pseudo-element before the content',
    target: [],
    inputs: {}
  },
  
  after: {
    label: 'after',
    type: 'pseudo-element',
    description: 'Creates a pseudo-element after the content',
    target: [],
    inputs: {}
  },
  
  'first-letter': {
    label: 'first-letter',
    type: 'pseudo-element',
    description: 'Selects the first letter of text content',
    target: [],
    inputs: {}
  },
  
  'first-line': {
    label: 'first-line',
    type: 'pseudo-element',
    description: 'Selects the first line of text content',
    target: [],
    inputs: {}
  }
};

// Type for pseudo-class schema entries
type PseudoClassSchemaEntry = {
  label: string;
  type: 'pseudo-class' | 'pseudo-element';
  description: string;
  target: string[];
  inputs: Record<string, string>;
};

// Type for the complete schema
type PseudoClassesSchemaType = Record<string, PseudoClassSchemaEntry>;

// Helper functions for pseudo-class validation and utilities
export const getPseudoClassesByType = (type: 'pseudo-class' | 'pseudo-element') => {
  return Object.entries(pseudoClassesSchema as PseudoClassesSchemaType)
    .filter(([_, schema]) => schema.type === type)
    .map(([key, schema]) => ({ key, ...schema }));
};

export const canPseudoClassTarget = (pseudoClassName: string): boolean => {
  const schema = (pseudoClassesSchema as PseudoClassesSchemaType)[pseudoClassName];
  return schema ? schema.target.length > 0 : false;
};

export const getPseudoClassTargetTypes = (pseudoClassName: string): string[] => {
  const schema = (pseudoClassesSchema as PseudoClassesSchemaType)[pseudoClassName];
  return schema ? schema.target : [];
};

export const requiresPseudoClassInput = (pseudoClassName: string): boolean => {
  const schema = (pseudoClassesSchema as PseudoClassesSchemaType)[pseudoClassName];
  return schema ? Object.keys(schema.inputs).length > 0 : false;
};

export const getPseudoClassInputs = (pseudoClassName: string): Record<string, string> => {
  const schema = (pseudoClassesSchema as PseudoClassesSchemaType)[pseudoClassName];
  return schema ? schema.inputs : {};
};
