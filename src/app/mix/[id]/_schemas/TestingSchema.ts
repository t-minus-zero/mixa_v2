const testSchema = {
gridTemplateColumns: {
    requirement: { property: "display", value: "grid" },
    label: "Columns",
    description: "Grid columns",
    inputType: "selection",
    labels: ["Global","Number","Keyword","List"], 
    options: ["{globalKeyword}","{number}", "{trackKeyword}", "{trackList}"], 
    default: "{trackKeyword}", 
    format: "grid-template-columns: {value};"
  },
  trackList: { 
    inputType: "list",  
    
    default: "{dimension}",
    options: ["{trackKeyword}", "{fraction}", "{dimension}", "{repeatFx}"],
    separator: " ", min: 1, max: 12,
    format: "{value}", 
},
autocomplete: {
    label: 'Autocomplete',
    description: 'Form autocomplete setting',
    inputType: 'select',
    options: ['on', 'off'],
    format: 'autocomplete="{value}"',
    default: 'off'
  },
  autofocus: {
    label: 'Autofocus',
    description: 'Element should get focus',
    inputType: 'boolean',
    format: 'autofocus',
    default: false
  },
};

