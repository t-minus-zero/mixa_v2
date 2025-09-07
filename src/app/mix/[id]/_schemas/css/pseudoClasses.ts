// Schema for CSS pseudo-classes and pseudo-elements
export const pseudoClassesSchema = {
  // Interactive pseudo-classes
  hover: {
    label: 'Hover',
    type: 'pseudo-class',
    description: 'Applies when element is hovered over',
    target: ['class', 'id'],
    default: 'hover',
    inputs: {},
    format: '&:{value}'
  },
  
  active: {
    label: 'Active',
    type: 'pseudo-class', 
    description: 'Applies when element is being activated (clicked)',
    target: ['class', 'id'],
    default: 'active',
    inputs: {},
    format: '&:{value}'
  },
  
  focus: {
    label: 'Focus',
    type: 'pseudo-class',
    description: 'Applies when element has focus',
    target: ['class', 'id'],
    default: 'focus',
    inputs: {},
    format: '&:{value}'
  },
  
  focusVisible: {
    label: 'Focus Visible',
    type: 'pseudo-class',
    description: 'Applies when element has focus and should show focus indicator',
    target: ['class', 'id'],
    default: 'focus-visible',
    inputs: {},
    format: '&:{value}'
  },
  
  visited: {
    label: 'Visited',
    type: 'pseudo-class',
    description: 'Applies to visited links',
    target: [],
    default: 'visited',
    inputs: {},
    format: '&:{value}'
  },
  
  // Structural pseudo-classes
  firstChild: {
    label: 'First Child',
    type: 'pseudo-class',
    description: 'Selects the first child element',
    target: [],
    default: 'first-child',
    inputs: {},
    format: ':{value}'
  },
  
  lastChild: {
    label: 'Last Child',
    type: 'pseudo-class',
    description: 'Selects the last child element',
    target: [],
    default: 'last-child',
    inputs: {},
    format: ':{value}'
  },
  
  nthChild: {
    label: 'Nth Child',
    type: 'pseudo-class',
    description: 'Selects nth child element based on formula',
    target: [],
    default: 'odd',
    inputs: { inputType: 'option', format: '{value}', default: 'odd',
      options: ['odd', 'even', '{number}', '{text}'] },
    format: ':nth-child({value})'
  },
  
  nthOfType: {
    label: 'Nth Of Type',
    type: 'pseudo-class',
    description: 'Selects nth element of its type',
    target: [],
    default: 'odd',
    inputs: { inputType: 'option', format: '{value}', default: 'odd',
      options: ['odd', 'even', '{number}', '{text}'] },
    format: ':nth-of-type({value})'
  },
  
  firstOfType: {
    label: 'First Of Type',
    type: 'pseudo-class',
    description: 'Selects the first element of its type',
    target: [],
    default: 'first-of-type',
    inputs: {},
    format: ':{value}'
  },
  
  lastOfType: {
    label: 'Last Of Type',
    type: 'pseudo-class',
    description: 'Selects the last element of its type',
    target: [],
    default: 'last-of-type',
    inputs: {},
    format: ':{value}'
  },
  
  // Form-related pseudo-classes
  checked: {
    label: 'Checked',
    type: 'pseudo-class',
    description: 'Applies to checked input elements',
    target: [],
    default: 'checked',
    inputs: {},
    format: ':{value}'
  },
  
  disabled: {
    label: 'Disabled',
    type: 'pseudo-class',
    description: 'Applies to disabled form elements',
    target: [],
    default: 'disabled',
    inputs: {},
    format: ':{value}'
  },
  
  enabled: {
    label: 'Enabled',
    type: 'pseudo-class',
    description: 'Applies to enabled form elements',
    target: [],
    default: 'enabled',
    inputs: {},
    format: ':{value}'
  },
  
  // Pseudo-elements
  before: {
    label: 'Before',
    type: 'pseudo-element',
    description: 'Creates a pseudo-element before the content',
    target: [],
    default: 'before',
    inputs: {},
    format: '::{value}'
  },
  
  after: {
    label: 'After',
    type: 'pseudo-element',
    description: 'Creates a pseudo-element after the content',
    target: [],
    default: 'after',
    inputs: {},
    format: '::{value}'
  },
  
  firstLetter: {
    label: 'First Letter',
    type: 'pseudo-element',
    description: 'Selects the first letter of text content',
    target: [],
    default: 'first-letter',
    inputs: {},
    format: '::{value}'
  },
  
  firstLine: {
    label: 'First Line',
    type: 'pseudo-element',
    description: 'Selects the first line of text content',
    target: [],
    default: 'first-line',
    inputs: {},
    format: '::{value}'
  }
};


// Helper functions for pseudo-class validation and utilities
export const getPseudoClassesByType = (type: 'pseudo-class' | 'pseudo-element') => {
  return Object.entries(pseudoClassesSchema)
    .filter(([_, schema]) => schema.type === type)
    .map(([key, schema]) => ({ key, ...schema }));
};

export const canPseudoClassTarget = (pseudoClassName: string): boolean => {
  const schema = pseudoClassesSchema[pseudoClassName];
  return schema ? schema.target.length > 0 : false;
};

export const getPseudoClassTargetTypes = (pseudoClassName: string): string[] => {
  const schema = pseudoClassesSchema[pseudoClassName];
  return schema ? schema.target : [];
};

export const requiresPseudoClassInput = (pseudoClassName: string): boolean => {
  const schema = pseudoClassesSchema[pseudoClassName];
  return schema ? typeof schema.inputs === 'string' || Object.keys(schema.inputs as object).length > 0 : false;
};

export const getPseudoClassInputs = (pseudoClassName: string): string | object => {
  const schema = pseudoClassesSchema[pseudoClassName];
  return schema ? schema.inputs : {};
};
