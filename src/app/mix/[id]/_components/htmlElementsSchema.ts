// Schema for HTML elements and their supported attributes
export const htmlElementsSchema = {
  // Container elements
  div: {
    name: 'div',
    description: 'Generic container element',
    attributes: ['id', 'class', 'title', 'tabindex', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'non-semantic']
  },
  span: {
    name: 'span',
    description: 'Inline container element',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'normal', 'non-semantic']
  },
  section: {
    name: 'section',
    description: 'Section container for content',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  article: {
    name: 'article',
    description: 'Self-contained composition',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  
  // Text elements
  p: {
    name: 'p',
    description: 'Paragraph element',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  h1: {
    name: 'h1',
    description: 'Heading level 1',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  h2: {
    name: 'h2',
    description: 'Heading level 2',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  h3: {
    name: 'h3',
    description: 'Heading level 3',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  h4: {
    name: 'h4',
    description: 'Heading level 4',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  h5: {
    name: 'h5',
    description: 'Heading level 5',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  h6: {
    name: 'h6',
    description: 'Heading level 6',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  
  // Interactive elements
  a: {
    name: 'a',
    description: 'Hyperlink',
    attributes: ['href', 'target', 'rel', 'download', 'id', 'class', 'title', 'tabindex', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'normal', 'interactive']
  },
  button: {
    name: 'button',
    description: 'Clickable button',
    attributes: ['type', 'disabled', 'autofocus', 'form', 'formaction', 'formmethod', 'formnovalidate', 'formtarget', 'id', 'class', 'title', 'tabindex', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline-block', 'normal', 'interactive', 'form']
  },
  input: {
    name: 'input',
    description: 'Input field',
    attributes: ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'readonly', 'checked', 'autocomplete', 'autofocus', 'form', 'formaction', 'list', 'max', 'maxlength', 'min', 'minlength', 'multiple', 'pattern', 'step', 'id', 'class', 'title', 'tabindex', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline-block', 'void', 'interactive', 'form']
  },
  select: {
    name: 'select',
    description: 'Dropdown selection',
    attributes: ['name', 'multiple', 'required', 'disabled', 'autofocus', 'form', 'id', 'class', 'title', 'tabindex', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline-block', 'normal', 'interactive', 'form']
  },
  textarea: {
    name: 'textarea',
    description: 'Multi-line text input',
    attributes: ['name', 'rows', 'cols', 'placeholder', 'required', 'disabled', 'readonly', 'autofocus', 'form', 'maxlength', 'minlength', 'wrap', 'id', 'class', 'title', 'tabindex', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline-block', 'normal', 'interactive', 'form']
  },
  
  // Multimedia elements
  img: {
    name: 'img',
    description: 'Image element',
    attributes: ['src', 'alt', 'width', 'height', 'loading', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'void', 'embedded']
  },
  video: {
    name: 'video',
    description: 'Video element',
    attributes: ['src', 'width', 'height', 'autoplay', 'controls', 'loop', 'muted', 'poster', 'preload', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline-block', 'normal', 'embedded']
  },
  audio: {
    name: 'audio',
    description: 'Audio element',
    attributes: ['src', 'autoplay', 'controls', 'loop', 'muted', 'preload', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'normal', 'embedded']
  },
  
  // List elements
  ul: {
    name: 'ul',
    description: 'Unordered list',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  ol: {
    name: 'ol',
    description: 'Ordered list',
    attributes: ['start', 'reversed', 'type', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  li: {
    name: 'li',
    description: 'List item',
    attributes: ['value', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  
  // Table elements
  table: {
    name: 'table',
    description: 'Table element',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic', 'table']
  },
  tr: {
    name: 'tr',
    description: 'Table row',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'table']
  },
  td: {
    name: 'td',
    description: 'Table cell',
    attributes: ['colspan', 'rowspan', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'table']
  },
  th: {
    name: 'th',
    description: 'Table header cell',
    attributes: ['colspan', 'rowspan', 'scope', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'table']
  },
  
  // Form elements
  form: {
    name: 'form',
    description: 'Form element',
    attributes: ['action', 'method', 'enctype', 'autocomplete', 'novalidate', 'target', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'form']
  },
  label: {
    name: 'label',
    description: 'Label for form elements',
    attributes: ['for', 'form', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'normal', 'form']
  },
  fieldset: {
    name: 'fieldset',
    description: 'Group of form elements',
    attributes: ['disabled', 'form', 'name', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'form']
  },
  
  // Semantic elements
  header: {
    name: 'header',
    description: 'Header section',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  footer: {
    name: 'footer',
    description: 'Footer section',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  nav: {
    name: 'nav',
    description: 'Navigation section',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  main: {
    name: 'main',
    description: 'Main content section',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  aside: {
    name: 'aside',
    description: 'Aside content',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  
  // SVG elements
  svg: {
    name: 'svg',
    description: 'SVG container for vector graphics',
    attributes: ['width', 'height', 'viewBox', 'xmlns', 'version', 'preserveAspectRatio', 'id', 'class', 'style'],
    elementTypes: ['inline', 'normal', 'graphic']
  },
  path: {
    name: 'path',
    description: 'Defines a path in SVG',
    attributes: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'id', 'class', 'style'],
    elementTypes: ['inline', 'normal', 'graphic']
  },
  
  // Void elements
  br: {
    name: 'br',
    description: 'Line break',
    attributes: ['id', 'class'],
    elementTypes: ['inline', 'void']
  },
  hr: {
    name: 'hr',
    description: 'Horizontal rule',
    attributes: ['id', 'class'],
    elementTypes: ['block', 'void']
  },
  area: {
    name: 'area',
    description: 'Area in an image map',
    attributes: ['alt', 'coords', 'shape', 'href', 'target', 'rel', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'void']
  },
  source: {
    name: 'source',
    description: 'Media source for video/audio',
    attributes: ['src', 'type', 'srcset', 'sizes', 'media', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'void', 'embedded']
  },
  track: {
    name: 'track',
    description: 'Text track for video/audio',
    attributes: ['src', 'kind', 'srclang', 'label', 'default', 'id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['inline', 'void', 'embedded']
  },
  wbr: {
    name: 'wbr',
    description: 'Word break opportunity',
    attributes: ['id', 'class'],
    elementTypes: ['inline', 'void']
  },
  
  // Additional void elements
  meta: {
    name: 'meta',
    description: 'Metadata information',
    attributes: ['name', 'content', 'charset', 'http-equiv', 'id', 'class'],
    elementTypes: ['metadata', 'void']
  },
  link: {
    name: 'link',
    description: 'Link to external resource',
    attributes: ['href', 'rel', 'type', 'media', 'sizes', 'id', 'class'],
    elementTypes: ['metadata', 'void']
  },
  param: {
    name: 'param',
    description: 'Parameter for object element',
    attributes: ['name', 'value', 'id'],
    elementTypes: ['void']
  },
  col: {
    name: 'col',
    description: 'Column properties in tables',
    attributes: ['span', 'id', 'class'],
    elementTypes: ['void', 'table']
  },
  embed: {
    name: 'embed',
    description: 'Embedded external content',
    attributes: ['src', 'type', 'width', 'height', 'id', 'class'],
    elementTypes: ['inline', 'void', 'embedded']
  }
};

// Schema for HTML attributes with string input types
export const htmlAttributesSchema = {
  // Global attributes
  id: {
    name: 'id',
    description: 'Unique identifier for an element',
    inputType: 'string'
  },
  class: {
    name: 'class',
    description: 'CSS class names',
    inputType: 'string'
  },
  title: {
    name: 'title',
    description: 'Additional information shown as tooltip',
    inputType: 'string'
  },
  tabindex: {
    name: 'tabindex',
    description: 'Tab order of an element',
    inputType: 'string'
  },
  hidden: {
    name: 'hidden',
    description: 'Indicates element is not relevant',
    inputType: 'string'
  },
  data: {
    name: 'data-*',
    description: 'Custom data attributes',
    inputType: 'string'
  },
  aria: {
    name: 'aria-*',
    description: 'Accessibility attributes',
    inputType: 'string'
  },
  role: {
    name: 'role',
    description: 'ARIA role of an element',
    inputType: 'string'
  },
  
  // Link attributes
  href: {
    name: 'href',
    description: 'URL for a link',
    inputType: 'string'
  },
  target: {
    name: 'target',
    description: 'Where to open the link',
    inputType: 'string'
  },
  rel: {
    name: 'rel',
    description: 'Relationship between current and linked document',
    inputType: 'string'
  },
  download: {
    name: 'download',
    description: 'Download link instead of navigating',
    inputType: 'string'
  },
  
  // Form attributes
  type: {
    name: 'type',
    description: 'Type of input or button',
    inputType: 'string'
  },
  name: {
    name: 'name',
    description: 'Name of form element',
    inputType: 'string'
  },
  value: {
    name: 'value',
    description: 'Value of form element',
    inputType: 'string'
  },
  placeholder: {
    name: 'placeholder',
    description: 'Placeholder text',
    inputType: 'string'
  },
  required: {
    name: 'required',
    description: 'Indicates a required field',
    inputType: 'string'
  },
  disabled: {
    name: 'disabled',
    description: 'Disables input',
    inputType: 'string'
  },
  readonly: {
    name: 'readonly',
    description: 'Makes input read-only',
    inputType: 'string'
  },
  autocomplete: {
    name: 'autocomplete',
    description: 'Autocomplete hints',
    inputType: 'string'
  },
  autofocus: {
    name: 'autofocus',
    description: 'Automatically focus on load',
    inputType: 'string'
  },
  form: {
    name: 'form',
    description: 'Form ID this element belongs to',
    inputType: 'string'
  },
  
  // Image and media attributes
  src: {
    name: 'src',
    description: 'Source URL',
    inputType: 'string'
  },
  alt: {
    name: 'alt',
    description: 'Alternative text',
    inputType: 'string'
  },
  width: {
    name: 'width',
    description: 'Width dimension',
    inputType: 'string'
  },
  height: {
    name: 'height',
    description: 'Height dimension',
    inputType: 'string'
  },
  loading: {
    name: 'loading',
    description: 'Image loading behavior',
    inputType: 'string'
  },
  
  // Table attributes
  colspan: {
    name: 'colspan',
    description: 'Number of columns a cell spans',
    inputType: 'string'
  },
  rowspan: {
    name: 'rowspan',
    description: 'Number of rows a cell spans',
    inputType: 'string'
  },
  scope: {
    name: 'scope',
    description: 'Scope of header cell',
    inputType: 'string'
  },
  
  // List attributes
  start: {
    name: 'start',
    description: 'Starting value of ordered list',
    inputType: 'string'
  },
  reversed: {
    name: 'reversed',
    description: 'Reverses order of list',
    inputType: 'string'
  },
  
  // Form submission attributes
  action: {
    name: 'action',
    description: 'URL where form data is sent',
    inputType: 'string'
  },
  method: {
    name: 'method',
    description: 'HTTP method for form submission',
    inputType: 'string'
  },
  enctype: {
    name: 'enctype',
    description: 'Form data encoding type',
    inputType: 'string'
  },
  novalidate: {
    name: 'novalidate',
    description: 'Disable form validation',
    inputType: 'string'
  },
  
  // Label attributes
  for: {
    name: 'for',
    description: 'ID of the element this label is for',
    inputType: 'string'
  },
  
  // SVG specific attributes
  xmlns: {
    name: 'xmlns',
    description: 'XML namespace for SVG',
    inputType: 'string'
  },
  viewBox: {
    name: 'viewBox',
    description: 'Defines the viewable area of the SVG',
    inputType: 'string'
  },
  preserveAspectRatio: {
    name: 'preserveAspectRatio',
    description: 'Controls aspect ratio behavior',
    inputType: 'string'
  },
  d: {
    name: 'd',
    description: 'Path data definition',
    inputType: 'string'
  },
  fill: {
    name: 'fill',
    description: 'Fill color for shapes',
    inputType: 'string'
  },
  stroke: {
    name: 'stroke',
    description: 'Stroke color for shapes',
    inputType: 'string'
  },
  'stroke-width': {
    name: 'stroke-width',
    description: 'Width of the stroke',
    inputType: 'string'
  },
  'stroke-linecap': {
    name: 'stroke-linecap',
    description: 'Shape of the stroke ends (butt, round, square)',
    inputType: 'string'
  },
  'stroke-linejoin': {
    name: 'stroke-linejoin',
    description: 'Shape of the stroke joins (miter, round, bevel)',
    inputType: 'string'
  },
  
  // Element specific attributes
};
