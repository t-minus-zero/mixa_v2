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
    description: 'CSS class name(s)',
    inputType: 'string'
  },
  title: {
    name: 'title',
    description: 'Advisory information',
    inputType: 'string'
  },
  style: {
    name: 'style',
    description: 'Inline CSS styles',
    inputType: 'string'
  },
  tabindex: {
    name: 'tabindex',
    description: 'Tab order of an element',
    inputType: 'number'
  },
  hidden: {
    name: 'hidden',
    description: 'Hides an element',
    inputType: 'boolean'
  },
  
  // Link attributes
  href: {
    name: 'href',
    description: 'URL/address of the link',
    inputType: 'string'
  },
  target: {
    name: 'target',
    description: 'Where to open the link',
    inputType: 'select',
    options: ['_self', '_blank', '_parent', '_top']
  },
  rel: {
    name: 'rel',
    description: 'Relationship of linked document',
    inputType: 'string'
  },
  download: {
    name: 'download',
    description: 'Download link destination',
    inputType: 'string'
  },
  
  // Form attributes
  action: {
    name: 'action',
    description: 'Where to send form data',
    inputType: 'string'
  },
  method: {
    name: 'method',
    description: 'HTTP method to use',
    inputType: 'select',
    options: ['get', 'post']
  },
  enctype: {
    name: 'enctype',
    description: 'How form data is encoded',
    inputType: 'select',
    options: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain']
  },
  name: {
    name: 'name',
    description: 'Name of the form element',
    inputType: 'string'
  },
  value: {
    name: 'value',
    description: 'Value of the form element',
    inputType: 'string'
  },
  placeholder: {
    name: 'placeholder',
    description: 'Hint text for input',
    inputType: 'string'
  },
  required: {
    name: 'required',
    description: 'Field is required',
    inputType: 'boolean'
  },
  disabled: {
    name: 'disabled',
    description: 'Element is disabled',
    inputType: 'boolean'
  },
  readonly: {
    name: 'readonly',
    description: 'Field is read-only',
    inputType: 'boolean'
  },
  type: {
    name: 'type',
    description: 'Type of input control',
    inputType: 'select',
    options: ['text', 'password', 'email', 'number', 'checkbox', 'radio', 'submit', 'button', 'file', 'date', 'time', 'color', 'range', 'hidden', 'search', 'tel', 'url', 'month', 'week']
  },
  
  // Image and media attributes
  src: {
    name: 'src',
    description: 'Source URL for media',
    inputType: 'string'
  },
  alt: {
    name: 'alt',
    description: 'Alternative text',
    inputType: 'string'
  },
  width: {
    name: 'width',
    description: 'Width of the element',
    inputType: 'number'
  },
  height: {
    name: 'height',
    description: 'Height of the element',
    inputType: 'number'
  },
  loading: {
    name: 'loading',
    description: 'How the image should be loaded',
    inputType: 'select',
    options: ['eager', 'lazy']
  },
  controls: {
    name: 'controls',
    description: 'Show media controls',
    inputType: 'boolean'
  },
  autoplay: {
    name: 'autoplay',
    description: 'Automatically start playback',
    inputType: 'boolean'
  },
  loop: {
    name: 'loop',
    description: 'Loop the media',
    inputType: 'boolean'
  },
  muted: {
    name: 'muted',
    description: 'Mute the media',
    inputType: 'boolean'
  },
  poster: {
    name: 'poster',
    description: 'Thumbnail image URL',
    inputType: 'string'
  },
  
  // Table attributes
  colspan: {
    name: 'colspan',
    description: 'Number of columns to span',
    inputType: 'number'
  },
  rowspan: {
    name: 'rowspan',
    description: 'Number of rows to span',
    inputType: 'number'
  },
  scope: {
    name: 'scope',
    description: 'Scope of header cell',
    inputType: 'select',
    options: ['row', 'col', 'rowgroup', 'colgroup']
  },
  
  // List attributes
  start: {
    name: 'start',
    description: 'Starting number for list',
    inputType: 'number'
  },
  reversed: {
    name: 'reversed',
    description: 'Reverse the order of list',
    inputType: 'boolean'
  },
  
  // Other attributes
  autocomplete: {
    name: 'autocomplete',
    description: 'Form autocomplete setting',
    inputType: 'select',
    options: ['on', 'off']
  },
  autofocus: {
    name: 'autofocus',
    description: 'Element should get focus',
    inputType: 'boolean'
  },
  form: {
    name: 'form',
    description: 'Form the element belongs to',
    inputType: 'string'
  },
  formaction: {
    name: 'formaction',
    description: 'URL for form submission',
    inputType: 'string'
  },
  formmethod: {
    name: 'formmethod',
    description: 'HTTP method for form',
    inputType: 'select',
    options: ['get', 'post']
  },
  
  // ARIA attributes (grouped)
  'aria': {
    name: 'aria-*',
    description: 'ARIA attribute (accessibility)',
    inputType: 'string'
  },
  'role': {
    name: 'role',
    description: 'ARIA role',
    inputType: 'string'
  },
  'data': {
    name: 'data-*',
    description: 'Custom data attribute',
    inputType: 'string'
  },
  
  // SVG specific attributes
  'viewBox': {
    name: 'viewBox',
    description: 'SVG viewport coordinates',
    inputType: 'string'
  },
  'xmlns': {
    name: 'xmlns',
    description: 'XML namespace',
    inputType: 'string'
  },
  'd': {
    name: 'd',
    description: 'SVG path data',
    inputType: 'string'
  },
  'fill': {
    name: 'fill',
    description: 'Fill color',
    inputType: 'string'
  },
  'stroke': {
    name: 'stroke',
    description: 'Stroke color',
    inputType: 'string'
  },
  'stroke-width': {
    name: 'stroke-width',
    description: 'Width of the stroke',
    inputType: 'string'
  }
};
