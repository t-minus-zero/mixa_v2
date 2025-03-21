export const cssInputTypes = {
    number: { 
        inputType: "number", min: null, max: null, step: 1, format: "{value}", default: 0 },
    text: { 
        inputType: "text", format: "{value}", default: "" },
    unit: {
        inputType: "selection", default: "px", format: "{value}",
        options: ["px", "%", "rem", "em", "vh", "vw", "fr"] },
    dimension: { 
        inputType: "composite", separator: "", options: ["{number}","{unit}"], format: "{value}", default: [{type: "number", value: 0},{ type: "unit", value: "px" }]},
    count: { 
        inputType: "number", min: 0, max: null, step: 1, format: "{value}", default: 0 },
    fraction: { 
        inputType: "number", min: 1, max: 12, step: 1, format: "{value}fr", default: 0 },
    globalKeyword: { 
        inputType: "selection", default: "unset", format: "{value}",
        options: ["none", "inherit", "initial", "unset", "revert", "revert-layer", "match-parent", "auto"],
     },
    trackKeyword: { 
        inputType: "selection", default: "max-content", format: "{value}",
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
        inputType: "function", separator: ", ", format: "minmax({value})", default: "0px 0px",  
        options: ["{size}", "{size}"]
    },
    fitContentFx: { 
        inputType: "function", separator: " ", format: "fit-content({value})", default: "0px",
        options: "{size}"
    },
    trackSizeList: { 
        inputType: "list", separator: " ", min: 1, max: 12, format: "{value}", default: "0px 0px",
        options: ["{size}"] 
    },
    repeatFx: { 
        inputType: "function", separator: ", ", format: "repeat({value})", default: "auto-fill 0px 0px",
        options: ["{repeatType}","{trackSizeList}"] 
    },
    trackList: { 
        inputType: "list", separator: " ", min: 1, max: 12, format: "{value}", default: "auto-fit 0fr 0px 0px",
        options: ["{trackKeyword}", "{fraction}", "{dimension}", "{repeatFx}"] 
    },
    individual: { 
        inputType: "list", separator: " ", min: 1, max: 4, format: "{value}", default: 0,
        options: ["{dimension}"]
    },
    colorKeywords: { 
        inputType: "selection", default: "transparent", format: "{value}",
        options: ["transparent", "current", "white", "black", "red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "gray", "olive", "navy", "maroon", "lime", "teal", "aqua", "fuchsia"]
    },
    borderList: {
        inputType: "composite", separator: " ", options: ["{dimension}","{borderKeywords}","{text}"], format: "{value}", 
        default: [{type: "dimension", value: [{type: "number", value: 0},{type: "unit", value: "px"}]},{ type: "borderKeywords", value: "solid" }, {type: "text", value: "#000000"}]
    },
    borderKeywords: { 
        inputType: "selection", default: "none", format: "{value}",
        options: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"]
    },
    backdropFilterBlur: { 
        inputType: "dimension", default: [{type: "number", value: 0}, {type: "unit", value: "px"}], format: "{value}",
    }
};