// Schema for HTML attributes with string input types
export const htmlAttributesSchema = {
  // Global attributes
  id: {
    label: 'ID',
    description: 'Unique identifier for an element',
    inputType: 'string',
    format: 'id="{value}"',
    default: ''
  },
  class: {
    label: 'Class',
    description: 'CSS class name(s)',
    inputType: 'string',
    format: 'class="{value}"',
    default: ''
  },
  title: {
    label: 'Title',
    description: 'Advisory information',
    inputType: 'string',
    format: 'title="{value}"',
    default: ''
  },
  style: {
    label: 'Style',
    description: 'Inline CSS styles',
    inputType: 'string',
    format: 'style="{value}"',
    default: ''
  },
  tabindex: {
    label: 'Tab Index',
    description: 'Tab order of an element',
    inputType: 'number',
    format: 'tabindex="{value}"',
    default: 0
  },
  hidden: {
    label: 'Hidden',
    description: 'Hides an element',
    inputType: 'boolean',
    options: ['hidden', ''],
    format: '{value}',
    default: false
  },
  
  // Link attributes
  href: {
    label: 'Href',
    description: 'URL/address of the link',
    inputType: 'string',
    format: 'href="{value}"',
    default: '#'
  },
  target: {
    label: 'Target',
    description: 'Where to open the link',
    inputType: 'selection',
    options: ['_self', '_blank', '_parent', '_top'],
    format: 'target="{value}"',
    default: '_self'
  },
  rel: {
    label: 'Rel',
    description: 'Relationship of linked document',
    inputType: 'string',
    format: 'rel="{value}"',
    default: ''
  },
  download: {
    label: 'Download',
    description: 'Download link destination',
    inputType: 'string',
    format: 'download="{value}"',
    default: ''
  },
  
  // Form attributes
  action: {
    label: 'Action',
    description: 'Where to send form data',
    inputType: 'string',
    format: 'action="{value}"',
    default: ''
  },
  method: {
    label: 'Method',
    description: 'HTTP method to use',
    inputType: 'selection',
    options: ['get', 'post'],
    format: 'method="{value}"',
    default: 'get'
  },
  enctype: {
    label: 'Encoding Type',
    description: 'How form data is encoded',
    inputType: 'selection',
    options: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
    format: 'enctype="{value}"',
    default: 'application/x-www-form-urlencoded'
  },
  name: {
    label: 'Name',
    description: 'Name of the form element',
    inputType: 'string',
    format: 'name="{value}"',
    default: ''
  },
  value: {
    label: 'Value',
    description: 'Value of the form element',
    inputType: 'string',
    format: 'value="{value}"',
    default: ''
  },
  placeholder: {
    label: 'Placeholder',
    description: 'Hint text for input',
    inputType: 'string',
    format: 'placeholder="{value}"',
    default: ''
  },
  required: {
    label: 'Required',
    description: 'Field is required',
    inputType: 'boolean',
    options: ['required', ''],
    format: '{value}',
    default: false
  },
  disabled: {
    label: 'Disabled',
    description: 'Element is disabled',
    inputType: 'boolean',
    options: ['disabled', ''],
    format: '{value}',
    default: false
  },
  readonly: {
    label: 'Read Only',
    description: 'Field is read-only',
    inputType: 'boolean',
    options: ['readonly', ''],
    format: '{value}',
    default: false
  },
  autocomplete: {
    label: 'Autocomplete',
    description: 'Form autocomplete setting',
    inputType: 'boolean',
    options: ['on', 'off'],
    format: 'autocomplete="{value}"',
    default: 'off'
  },
  autofocus: {
    label: 'Autofocus',
    description: 'Element should get focus',
    inputType: 'boolean',
    options: ['autofocus', ''],
    format: '{value}',
    default: false
  },
  type: {
    label: 'Type',
    description: 'Type of input control',
    inputType: 'selection',
    options: ['text', 'password', 'email', 'number', 'checkbox', 'radio', 'submit', 'button', 'file', 'date', 'time', 'color', 'range', 'hidden', 'search', 'tel', 'url', 'month', 'week'],
    format: 'type="{value}"',
    default: 'text'
  },
  
  // Image and media attributes
  src: {
    label: 'Source',
    description: 'Source URL for media',
    inputType: 'string',
    format: 'src="{value}"',
    default: ''
  },
  alt: {
    label: 'Alt Text',
    description: 'Alternative text',
    inputType: 'string',
    format: 'alt="{value}"',
    default: ''
  },
  width: {
    label: 'Width',
    description: 'Width of the element',
    inputType: 'number',
    format: 'width="{value}"',
    default: 0
  },
  height: {
    label: 'Height',
    description: 'Height of the element',
    inputType: 'number',
    format: 'height="{value}"',
    default: 0
  },
  loading: {
    label: 'Loading',
    description: 'How the image should be loaded',
    inputType: 'selection',
    options: ['eager', 'lazy'],
    format: 'loading="{value}"',
    default: 'eager'
  },
  controls: {
    label: 'Controls',
    description: 'Show media controls',
    inputType: 'boolean',
    options: ['controls', ''],
    format: '{value}',
    default: false
  },
  autoplay: {
    label: 'Autoplay',
    description: 'Automatically start playback',
    inputType: 'boolean',
    options: ['autoplay', ''],
    format: '{value}',
    default: false
  },
  loop: {
    label: 'Loop',
    description: 'Loop the media',
    inputType: 'boolean',
    options: ['loop', ''],
    format: '{value}',
    default: false
  },
  muted: {
    label: 'Muted',
    description: 'Mute the media',
    inputType: 'boolean',
    options: ['muted', ''],
    format: '{value}',
    default: false
  },
  poster: {
    label: 'Poster',
    description: 'Thumbnail image URL',
    inputType: 'string',
    format: 'poster="{value}"',
    default: ''
  },
  
  // Table attributes
  colspan: {
    label: 'Column Span',
    description: 'Number of columns to span',
    inputType: 'number',
    format: 'colspan="{value}"',
    default: 1
  },
  rowspan: {
    label: 'Row Span',
    description: 'Number of rows to span',
    inputType: 'number',
    format: 'rowspan="{value}"',
    default: 1
  },
  scope: {
    label: 'Scope',
    description: 'Scope of header cell',
    inputType: 'selection',
    options: ['row', 'col', 'rowgroup', 'colgroup'],
    format: 'scope="{value}"',
    default: 'col'
  },
  
  // List attributes
  start: {
    label: 'Start',
    description: 'Starting number for list',
    inputType: 'number',
    format: 'start="{value}"',
    default: 1
  },
  reversed: {
    label: 'Reversed',
    description: 'Reverse the order of list',
    inputType: 'boolean',
    options: ['reversed', ''],
    format: '{value}',
    default: false
  },
  
  // Other attributes - removed duplicates of autocomplete and autofocus
  form: {
    label: 'Form',
    description: 'Form the element belongs to',
    inputType: 'string',
    format: 'form="{value}"',
    default: ''
  },
  formaction: {
    label: 'Form Action',
    description: 'URL for form submission',
    inputType: 'string',
    format: 'formaction="{value}"',
    default: ''
  },
  formmethod: {
    label: 'Form Method',
    description: 'HTTP method for form',
    inputType: 'selection',
    options: ['get', 'post'],
    format: 'formmethod="{value}"',
    default: 'get'
  },
  
  // ARIA attributes (grouped)
  'aria': {
    label: 'ARIA',
    description: 'ARIA attribute (accessibility)',
    inputType: 'string',
    format: 'aria-*="{value}"',
    default: ''
  },
  'role': {
    label: 'Role',
    description: 'ARIA role',
    inputType: 'string',
    format: 'role="{value}"',
    default: ''
  },
  'data': {
    label: 'Data',
    description: 'Custom data attribute',
    inputType: 'string',
    format: 'data-*="{value}"',
    default: ''
  },
  
  // SVG specific attributes
  'viewBox': {
    label: 'View Box',
    description: 'SVG viewport coordinates',
    inputType: 'string',
    format: 'viewBox="{value}"',
    default: '0 0 100 100'
  },
  'xmlns': {
    label: 'XML Namespace',
    description: 'XML namespace',
    inputType: 'string',
    format: 'xmlns="{value}"',
    default: 'http://www.w3.org/2000/svg'
  },
  'd': {
    label: 'Path Data',
    description: 'SVG path data',
    inputType: 'string',
    format: 'd="{value}"',
    default: ''
  },
  'fill': {
    label: 'Fill',
    description: 'Fill color',
    inputType: 'string',
    format: 'fill="{value}"',
    default: 'none'
  },
  'stroke': {
    label: 'Stroke',
    description: 'Stroke color',
    inputType: 'string',
    format: 'stroke="{value}"',
    default: 'black'
  },
  'stroke-width': {
    label: 'Stroke Width',
    description: 'Width of the stroke',
    inputType: 'string',
    format: 'stroke-width="{value}"',
    default: '1'
  }
};
