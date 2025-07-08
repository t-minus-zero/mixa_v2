export const inputsSchema = {
    number: { 
        label: 'Number', inputType: 'number', min: null, max: null, step: 1, format: '{value}', default: 0 },
    text: { 
        label: 'Text', inputType: 'text', format: '{value}', default: '' },
    color: { 
        label: 'Color', inputType: 'text', format: '{value}', default: '#32a1ce' },
    unit: {
        label: 'Unit', inputType: 'option', default: 'px', format: '{value}',
        options: ['px', '%', 'rem', 'em', 'vh', 'vw', 'fr'] },
    dimension: { 
        label: 'Dimension', inputType: 'composite', separator: '', options: ['{number}','{unit}'], format: '{value}', default: ['{number}','{unit}'] }, 
    count: { 
        label: 'Count', inputType: 'number', min: 0, max: null, step: 1, format: '{value}', default: 0 },
    fraction: { 
        label: 'Fraction', inputType: 'number', min: 1, max: 12, step: 1, format: '{value}fr', default: 0 },
    globalKeyword: { 
        label: 'Global Keyword', inputType: 'option', default: 'unset', format: '{value}',
        options: ['none', 'inherit', 'initial', 'unset', 'revert', 'revert-layer', 'match-parent', 'auto'],
     },
    colorKeywords: { 
        label: 'Color Keywords', inputType: 'option', default: 'currentColor', format: '{value}',
        options: ['currentColor', 'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'black', 'silver', 'gray', 'maroon', 'olive', 'purple', 'teal', 'navy'],
     },
    trackKeyword: { 
        label: 'Track Keyword', inputType: 'option', default: 'max-content', format: '{value}',
        options: ['auto', 'max-content', 'min-content'],
     },
    repeatType: { 
        label: 'Repeat Type', inputType: 'option', default: 'auto-fill', format: '{value}',
        options: ['auto-fit', 'auto-fill', '{count}'],  
       },
    size: { 
        label: 'Size', inputType: 'option', default: '{dimension}', format: '{value}',
        options: ['{fraction}', '{dimension}'],  
    },
    minMaxList:{
        label: 'Min Max List', inputType: 'option', format: '{value}', default: '{size}',
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
        label: 'Repeat (Fx)', inputType: 'composite', separator: ', ', format: 'repeat({value})', default: ['{repeatType}','{trackSizeList}'],
        options: ['{repeatType}','{trackSizeList}'] 
    },
    trackList: { 
        label: 'Track List', inputType: 'list', separator: ' ', min: 1, max: 12, format: '{value}', default: ['{trackKeyword}','{dimension}'],
        options: ['{trackKeyword}', '{fraction}', '{dimension}', '{repeatFx}'] 
    },
    individual: { 
        label: 'Individual', inputType: 'option', default: 'normal', format: '{value}',
        options: ['normal', 'stretch', 'center', 'flex-start', 'flex-end', 'start', 'end', 'self-start', 'self-end']
    },
    nth: { 
        label: 'Nth', inputType: 'option', format: '{value}', default: '2n+1',
        options: ['odd', 'even', '{number}', '{text}']
    },
    borderFx: { 
        label: 'Border', inputType: 'composite', separator: ' ', format: '{value};', default: ['{dimension}','{lineStyle}', '{colorList}'],
        options: ['{dimension}', '{lineStyle}', '{colorList}'] 
    },
    colorList: { 
        label: 'Color List', inputType: 'list', separator: ' ', min: 1, max: 4, format: '{value}', default: ['{colorKeywords}','{colorKeywords}'],
        options: ['{colorKeywords}', '{color}'] 
    },
    lineStyle: { 
        label: 'Line Style', inputType: 'option', default: 'solid', format: '{value}',
        options: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']
    },
    //NewTypes
    flex: { 
        
    },

};
