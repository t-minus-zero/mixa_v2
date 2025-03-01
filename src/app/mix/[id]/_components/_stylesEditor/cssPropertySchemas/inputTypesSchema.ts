export const cssInputTypes = {
    number: { 
        type: "number", min: null, max: null, step: 1, format: "{value}" },
    unit: { 
        type: "selection", default: "px", format: "{value}",
        options: ["px", "%", "rem", "em", "vh", "vw"] },
    dimension: { 
        type: "composite", separator: "", format: "{number}{unit}"},
    count: { 
        type: "number", min: 0, max: null, step: 1, format: "{value}" },
    fraction: { 
        type: "number", min: 1, max: 12, step: 1, format: "{value}fr" },
    globalKeyword: { 
        type: "selection", default: "none", format: "{value}",
        options: ["none", "inherit", "initial", "unset", "revert", "revert-layer", "match-parent", "auto"],
     },
    trackKeyword: { 
        type: "selection", default: "none", format: "{value}",
        options: ["auto", "max-content", "min-content"],
     },
    repeatType: { 
        type: "selection", default: "auto-fill", format: "{value}",
        options: ["auto-fit", "auto-fill", "{count}"],  
    },
    size: { 
        type: "selection", default: "{fraction}", format: "{value}",
        options: ["{fraction}", "{dimension}"],  
    },
    minMaxFx: { 
        type: "function", separator: ", ", format: "minmax({size}, {size})"
    },
    fitContentFx: { 
        type: "function", separator: " ", format: "fit-content({size})"
    },
    trackSizeList: { 
        type: "list", separator: " ", min: 1, max: 12, format: "{values}", 
        items: ["{size}"] 
    },
    repeatFx: { 
        type: "function", separator: ", ", format: "repeat({repeatType}, {trackSizeList})"
    },
    trackList: { 
        type: "list", separator: " ", min: 1, max: 12, format: "{values}", 
        items: ["{trackKeyword}", "{fraction}", "{dimension}", "{repeatFx}"] 
    }
};