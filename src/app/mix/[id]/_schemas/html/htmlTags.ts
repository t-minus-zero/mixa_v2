// Schema for HTML elements and their supported attributes
export const htmlTagsSchema = {
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
    description: 'Aside content (sidebar)',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'normal', 'semantic']
  },
  
  // Void elements (self-closing)
  br: {
    name: 'br',
    description: 'Line break',
    attributes: ['id', 'class', 'title', 'hidden', 'data'],
    elementTypes: ['inline', 'void']
  },
  hr: {
    name: 'hr',
    description: 'Horizontal rule',
    attributes: ['id', 'class', 'title', 'hidden', 'data', 'aria', 'role'],
    elementTypes: ['block', 'void']
  },
  
  // Media elements
  source: {
    name: 'source',
    description: 'Media source',
    attributes: ['src', 'type', 'media', 'srcset', 'sizes', 'id', 'class'],
    elementTypes: ['inline', 'void', 'embedded']
  },
  track: {
    name: 'track',
    description: 'Text track for media',
    attributes: ['src', 'kind', 'srclang', 'label', 'default', 'id', 'class'],
    elementTypes: ['inline', 'void', 'embedded']
  },
  
  // Additional void elements
  meta: {
    name: 'meta',
    description: 'Metadata information',
    attributes: ['name', 'content', 'charset', 'http-equiv', 'id', 'class'],
    elementTypes: ['head', 'void']
  },
  link: {
    name: 'link',
    description: 'External resource link',
    attributes: ['href', 'rel', 'type', 'media', 'sizes', 'id', 'class'],
    elementTypes: ['head', 'void']
  },
  
  // SVG elements
  svg: {
    name: 'svg',
    description: 'SVG container',
    attributes: ['viewBox', 'width', 'height', 'xmlns', 'id', 'class', 'stroke', 'fill', 'stroke-width'],
    elementTypes: ['inline-block', 'normal', 'svg']
  },
  path: {
    name: 'path',
    description: 'SVG path',
    attributes: ['d', 'stroke', 'fill', 'stroke-width', 'id', 'class'],
    elementTypes: ['svg', 'void']
  }
};