export const cssInputTypes = {
    number: { 
        inputType: "number", min: null, max: null, step: 1, format: "{value}" },
    unit: { 
        inputType: "selection", default: "px", format: "{value}",
        options: ["px", "%", "rem", "em", "vh", "vw"] },
    dimension: { 
        inputType: "composite", separator: "", options: ["{number}","{unit}"], format: "{value}"},
    count: { 
        inputType: "number", min: 0, max: null, step: 1, format: "{value}" },
    fraction: { 
        inputType: "number", min: 1, max: 12, step: 1, format: "{value}fr" },
    globalKeyword: { 
        inputType: "selection", default: "none", format: "{value}",
        options: ["none", "inherit", "initial", "unset", "revert", "revert-layer", "match-parent", "auto"],
     },
    trackKeyword: { 
        inputType: "selection", default: "none", format: "{value}",
        options: ["auto", "max-content", "min-content"],
     },
    repeatType: { 
        inputType: "selection", default: "auto-fill", format: "{value}",
        options: ["auto-fit", "auto-fill", "{count}"],  
       },
    size: { 
        inputType: "selection", default: "{fraction}", format: "{value}",
        options: ["{fraction}", "{dimension}"],  
    },
    minMaxFx: { 
        inputType: "function", separator: ", ", options: ["{size}", "{size}"], format: "minmax({value})",
    },
    fitContentFx: { 
        inputType: "function", separator: " ", options: "fit-content({size})", format: "fit-content({value})"
    },
    trackSizeList: { 
        inputType: "list", separator: " ", min: 1, max: 12, format: "{value}", 
        options: ["{size}"] 
    },
    repeatFx: { 
        inputType: "function", separator: ", ", options: ["{repeatType}","{trackSizeList}"], format: "repeat({value})"
    },
    trackList: { 
        inputType: "list", separator: " ", min: 1, max: 12, format: "{value}", 
        options: ["{trackKeyword}", "{fraction}", "{dimension}", "{repeatFx}"] 
    }
};