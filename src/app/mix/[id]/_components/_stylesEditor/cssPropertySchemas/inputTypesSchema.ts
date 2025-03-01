export const cssInputTypes = {
    number: { type: "number", min: null, max: null, step: 1, format: "{value}" },
    unit: { type: "selection", options: ["px", "%", "rem", "em", "vh", "vw"], default: "px", format: "{value}" },
    dimension: { type: "dual", format: "{number}{unit}"},
    count: { type: "number", min: 0, max: null, step: 1, format: "{value}" },
    fraction: { type: "number", min: 1, max: 12, step: 1, format: "{value}fr" },
    globalKeyword: { type: "selection", options: ["none", "inherit", "initial", "unset", "revert", "revert-layer", "match-parent", "auto"], default: "none", format: "{value}" },
    trackKeyword: { type: "selection", options: ["auto", "max-content", "min-content"], default: "none", format: "{value}" },
    repeatType: { type: "selection", options: ["auto-fit", "auto-fill", "{count}"], default: "{count}", format: "{value}" },
    size: { type: "selection", options: ["{fraction}", "{dimension}"], default: "{fraction}", format: "{value}" },
    minMaxFx: { type: "function", format: "minmax({size}, {size})"},
    fitContentFx: { type: "function", format: "fit-content({size})"},
    trackSizeList: { type: "list", min: 1, max: 12, format: "{items}", items: ["{size}"] },
    repeatFx: { type: "function", format: "repeat({repeatType}, {trackSizeList})"},
    trackList: { type: "list", min: 1, max: 12, format: "{items}", items: ["{trackKeyword}", "{fraction}", "{dimension}", "{repeatFx}"] }
};