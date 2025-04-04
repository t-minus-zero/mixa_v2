export const inputsSchema = {
    number: { 
        label: 'Number', inputType: 'number', min: null, max: null, step: 1, format: '{value}', default: 0 },
    text: { 
        label: 'Text', inputType: 'text', format: '{value}', default: '' },
    unit: {
        label: 'Unit', inputType: 'selection', default: 'px', format: '{value}',
        options: ['px', '%', 'rem', 'em', 'vh', 'vw', 'fr'] },
    dimension: { 
        label: 'Dimension', inputType: 'function', separator: '', options: ['{number}','{unit}'], format: '{value}', default: ['{number}','{unit}'] }, 
    count: { 
        label: 'Count', inputType: 'number', min: 0, max: null, step: 1, format: '{value}', default: 0 },
    fraction: { 
        label: 'Fraction', inputType: 'number', min: 1, max: 12, step: 1, format: '{value}fr', default: 0 },
    globalKeyword: { 
        label: 'Global Keyword', inputType: 'selection', default: 'unset', format: '{value}',
        options: ['none', 'inherit', 'initial', 'unset', 'revert', 'revert-layer', 'match-parent', 'auto'],
     },
    trackKeyword: { 
        label: 'Track Keyword', inputType: 'selection', default: 'max-content', format: '{value}',
        options: ['auto', 'max-content', 'min-content'],
     },
    repeatType: { 
        label: 'Repeat Type', inputType: 'selection', default: 'auto-fill', format: '{value}',
        options: ['auto-fit', 'auto-fill', '{count}'],  
       },
    size: { 
        label: 'Size', inputType: 'selection', default: '{dimension}', format: '{value}',
        options: ['{fraction}', '{dimension}'],  
    },
    minMaxList:{
        label: 'Min Max List', inputType: 'selection', format: '{value}', default: '{size}',
        options: ['{size}', '{trackKeyword}']
    },
    minMaxFx: { 
        label: 'Min Max', inputType: 'function', separator: ', ', format: 'minmax({value})', default: ['{minMaxList}','{minMaxList}'],  
        options: ['{minMaxList}', '{minMaxList}']
    },
    fitContentFx: { 
        label: 'Fit Content', inputType: 'function', separator: ' ', format: 'fit-content({value})', default: '{size}',
        options: '{size}'
    },
    trackSizeList: { 
        label: 'List of sizes', inputType: 'list', separator: ' ', min: 1, max: 12, format: '{value}', default: ['{size}','{size}'],
        options: ['{size}'] 
    },
    repeatFx: { 
        label: 'Repeat (Fx)', inputType: 'function', separator: ', ', format: 'repeat({value})', default: ['auto-fill','{dimension}','{dimension}'],
        options: ['{repeatType}','{trackSizeList}'] 
    },
    trackList: { 
        label: 'Track List', inputType: 'list', separator: ' ', min: 1, max: 12, format: '{value}', default: ['{trackKeyword}','{dimension}'],
        options: ['{trackKeyword}', '{fraction}', '{dimension}', '{repeatFx}'] 
    },
    individual: { 
        label: 'Individual', inputType: 'selection', default: 'normal', format: '{value}',
        options: ['normal', 'stretch', 'center', 'flex-start', 'flex-end', 'start', 'end', 'self-start', 'self-end']
    },
};
