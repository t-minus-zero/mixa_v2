// Schema for CSS screen/media query constraints
export const screensSchema = {
  // Min-width constraints (mobile-first approach)
  minWidth: {
    label: 'Min Width',
    type: 'screen',
    description: 'Applies styles when screen width is at least the specified value',
    target: [],
    default: '768px',
    inputs: { inputType: 'option', options: ['{dimension}', '{text}'], default: '{dimension}', format: '{value}' },
    format: '@media (min-width: {value})'
  },
  
  // Max-width constraints (desktop-first approach)
  maxWidth: {
    label: 'Max Width',
    type: 'screen',
    description: 'Applies styles when screen width is at most the specified value',
    target: [],
    default: '1023px',
    inputs: { inputType: 'option', options: ['{dimension}', '{text}'], default: '{dimension}', format: '{value}' },
    format: '@media (max-width: {value})'
  },
  
  // Width range constraints (between two values)
  widthRange: {
    label: 'Width Range',
    type: 'screen',
    description: 'Applies styles when screen width is between min and max values',
    target: [],
    default: ['768px', '1023px'],
    inputs: { 
      inputType: 'composite', 
      separator: ' and ',
      options: ['{dimension}', '{dimension}'],
      default: ['{dimension}', '{dimension}'],
      format: '{value}'
    },
    format: '@media (min-width: {value})'
  },
  
  // Min-height constraints
  minHeight: {
    label: 'Min Height',
    type: 'screen',
    description: 'Applies styles when screen height is at least the specified value',
    target: [],
    default: '600px',
    inputs: { inputType: 'option', options: ['{dimension}', '{text}'], default: '{dimension}', format: '{value}' },
    format: '@media (min-height: {value})'
  },
  
  // Max-height constraints
  maxHeight: {
    label: 'Max Height',
    type: 'screen',
    description: 'Applies styles when screen height is at most the specified value',
    target: [],
    default: '800px',
    inputs: { inputType: 'option', options: ['{dimension}', '{text}'], default: '{dimension}', format: '{value}' },
    format: '@media (max-height: {value})'
  },
  
  // Height range constraints
  heightRange: {
    label: 'Height Range',
    type: 'screen',
    description: 'Applies styles when screen height is between min and max values',
    target: [],
    default: ['600px', '800px'],
    inputs: { 
      inputType: 'composite', 
      separator: ' and ',
      options: ['{dimension}', '{dimension}'],
      default: ['{dimension}', '{dimension}'],
      format: '{value}'
    },
    format: '@media (min-height: {value})'
  },
  
  // Orientation constraints
  orientation: {
    label: 'Orientation',
    type: 'screen',
    description: 'Applies styles based on device orientation',
    target: [],
    default: 'portrait',
    inputs: { inputType: 'option', options: ['portrait', 'landscape'], default: 'portrait', format: '{value}' },
    format: '@media (orientation: {value})'
  },
  
  // Aspect ratio constraints
  aspectRatio: {
    label: 'Aspect Ratio',
    type: 'screen',
    description: 'Applies styles when screen has specific aspect ratio',
    target: [],
    default: '16/9',
    inputs: { inputType: 'text', default: '16/9', format: '{value}' },
    format: '@media (aspect-ratio: {value})'
  },
  
  minAspectRatio: {
    label: 'Min Aspect Ratio',
    type: 'screen',
    description: 'Applies styles when screen aspect ratio is at least the specified value',
    target: [],
    default: '4/3',
    inputs: { inputType: 'text', default: '4/3', format: '{value}' },
    format: '@media (min-aspect-ratio: {value})'
  },
  
  maxAspectRatio: {
    label: 'Max Aspect Ratio',
    type: 'screen',
    description: 'Applies styles when screen aspect ratio is at most the specified value',
    target: [],
    default: '21/9',
    inputs: { inputType: 'text', default: '21/9', format: '{value}' },
    format: '@media (max-aspect-ratio: {value})'
  },
  
  // Resolution/DPI constraints
  minResolution: {
    label: 'Min Resolution',
    type: 'screen',
    description: 'Applies styles when screen resolution is at least the specified DPI',
    target: [],
    default: '192dpi',
    inputs: { inputType: 'text', default: '192dpi', format: '{value}' },
    format: '@media (min-resolution: {value})'
  },
  
  // Hover capability
  hover: {
    label: 'Hover Capability',
    type: 'screen',
    description: 'Applies styles based on device hover capability',
    target: [],
    default: 'hover',
    inputs: { inputType: 'option', options: ['hover', 'none'], default: 'hover', format: '{value}' },
    format: '@media (hover: {value})'
  },
  
  // Pointer precision
  pointer: {
    label: 'Pointer Precision',
    type: 'screen',
    description: 'Applies styles based on pointing device precision',
    target: [],
    default: 'fine',
    inputs: { inputType: 'option', options: ['fine', 'coarse', 'none'], default: 'fine', format: '{value}' },
    format: '@media (pointer: {value})'
  },
  
  // Motion preference
  reducedMotion: {
    label: 'Motion Preference',
    type: 'screen',
    description: 'Applies styles based on user motion preference',
    target: [],
    default: 'reduce',
    inputs: { inputType: 'option', options: ['reduce', 'no-preference'], default: 'reduce', format: '{value}' },
    format: '@media (prefers-reduced-motion: {value})'
  },
  
  // Color scheme preference
  colorScheme: {
    label: 'Color Scheme',
    type: 'screen',
    description: 'Applies styles based on user color scheme preference',
    target: [],
    default: 'dark',
    inputs: { inputType: 'option', options: ['dark', 'light'], default: 'dark', format: '{value}' },
    format: '@media (prefers-color-scheme: {value})'
  },
  
  // Print media
  print: {
    label: 'Print',
    type: 'print',
    description: 'Applies styles when content is being printed',
    target: [],
    default: 'print',
    inputs: {},
    format: '@media {value}'
  }
};

// Helper functions for screen validation and utilities
export const getScreensByType = (type: 'screen' | 'print') => {
  return Object.entries(screensSchema)
    .filter(([_, schema]) => schema.type === type)
    .map(([key, schema]) => ({ key, ...schema }));
};

export const requiresScreenInput = (screenName: string): boolean => {
  const schema = screensSchema[screenName];
  return schema ? typeof schema.inputs === 'object' && Object.keys(schema.inputs).length > 0 : false;
};

export const getScreenInputs = (screenName: string): string | object => {
  const schema = screensSchema[screenName];
  return schema ? schema.inputs : {};
};
