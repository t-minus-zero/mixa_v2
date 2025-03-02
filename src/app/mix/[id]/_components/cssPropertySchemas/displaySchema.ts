export const cssDisplaySchema = {
    display: {
      default: "none",
      label: "Display",
      inputs: { inputType: "selection", options: ["none", "block", "inline", "flex", "grid", "inline-block", "inline-flex", "inline-grid"], default: "none", format: "{value}" },
      format: "display: {value};"
    },
    gridTemplateColumns: {
      requirement: { property: "display", value: "grid" },
      default: "none",  
      label: "Columns",
      inputs: { inputType: "selection", options: ["{number}","{globalKeyword}", "{trackKeyword}", "{trackList}"], default: "{fraction}", format: "{value}" },
      format: "grid-template-columns: {value};"
    },
    gridTemplateRows: {
      requirement: { property: "display", value: "grid" },
      default: "none",
      label: "Rows",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{trackKeyword}", "{trackList}"], default: "{fraction}", format: "{value}" },
      format: "grid-template-rows: {value};"
    },
    gridGap: {
      requirement: { property: "display", value: ["grid", "flex"] },
      default: "0",
      label: "Gap",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{dimension}"], default: "{fraction}", format: "{value}" },
      format: "gap: {value};"
    },
    alignItems: {
      requirement: { property: "display", value: ["flex"] },
      default: "none",
      label: "Align",
      inputs: { inputType: "selection", options: ["none", "flex-start", "flex-end", "center", "stretch"], default: "none", format: "{value}" },
      format: "align-items: {value};"
    },
    justifyContent: {
      requirement: { property: "display", value: ["flex"] },
      default: "none",
      label: "Justify",
      inputs: { inputType: "selection", options: ["none", "flex-start", "flex-end", "center", "space-between", "space-around"], default: "none", format: "{value}" },
      format: "justify-content: {value};"
    }
};
