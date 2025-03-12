export const cssDisplaySchema = {
    display: {
      default: "none",
      label: "Display",
      inputs: { inputType: "selection", options: ["none", "block", "inline", "flex", "grid", "inline-block", "inline-flex", "inline-grid"], default: "none", format: "{value}" },
      format: "display: {value};"
    },
    flexDirection: {
      requirement: { property: "display", value: ["flex", "inline-flex"] },
      default: "row",
      label: "Flex Direction",
      inputs: { inputType: "selection", options: ["row", "row-reverse", "column", "column-reverse"], default: "row", format: "{value}" },
      format: "flex-direction: {value};"
    },
    flexWrap: {
      requirement: { property: "display", value: ["flex", "inline-flex"] },
      default: "nowrap",
      label: "Flex Wrap",
      inputs: { inputType: "selection", options: ["nowrap", "wrap", "wrap-reverse"], default: "nowrap", format: "{value}" },
      format: "flex-wrap: {value};"
    },
    flexGrow: {
      requirement: { property: "display", value: ["flex", "inline-flex"] },
      default: "0",
      label: "Flex Grow",
      inputs: { inputType: "number", default: "0", format: "{value}" },
      format: "flex-grow: {value};"
    },
    flexShrink: {
      requirement: { property: "display", value: ["flex", "inline-flex"] },
      default: "1",
      label: "Flex Shrink",
      inputs: { inputType: "number", default: "1", format: "{value}" },
      format: "flex-shrink: {value};"
    },
    gridTemplateColumns: {
      requirement: { property: "display", value: "grid" },
      default: "none",  
      label: "Columns",
      inputs: { inputType: "selection", options: ["{number}","{globalKeyword}", "{trackKeyword}", "{trackList}"], default: "{trackKeyword}", format: "{value}" },
      format: "grid-template-columns: {value};"
    },
    gridTemplateRows: {
      requirement: { property: "display", value: "grid" },
      default: "none",
      label: "Rows",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{trackKeyword}", "{trackList}"], default: "{trackKeyword}", format: "{value}" },
      format: "grid-template-rows: {value};"
    },
    gridGap: {
      requirement: { property: "display", value: ["grid", "flex"] },
      default: "0",
      label: "Gap",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "gap: {value};"
    },
    alignItems: {
      requirement: { property: "display", value: ["flex", "grid", "inline-flex", "inline-grid"] },
      default: "none",
      label: "Align Items",
      inputs: { inputType: "selection", options: ["none", "flex-start", "flex-end", "center", "stretch", "baseline"], default: "center", format: "{value}" },
      format: "align-items: {value};"
    },
    alignContent: {
      requirement: { property: "display", value: ["flex", "grid", "inline-flex", "inline-grid"] },
      default: "normal",
      label: "Align Content",
      inputs: { inputType: "selection", options: ["normal", "flex-start", "flex-end", "center", "stretch", "space-between", "space-around"], default: "normal", format: "{value}" },
      format: "align-content: {value};"
    },
    alignSelf: {
      requirement: { property: "display", value: ["flex", "grid", "inline-flex", "inline-grid"] },
      default: "auto",
      label: "Align Self",
      inputs: { inputType: "selection", options: ["auto", "flex-start", "flex-end", "center", "stretch", "baseline"], default: "auto", format: "{value}" },
      format: "align-self: {value};"
    },
    justifyContent: {
      requirement: { property: "display", value: ["flex", "grid", "inline-flex", "inline-grid"] },
      default: "none",
      label: "Justify Content",
      inputs: { inputType: "selection", options: ["none", "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"], default: "center", format: "{value}" },
      format: "justify-content: {value};"
    },
    justifyItems: {
      requirement: { property: "display", value: ["grid", "inline-grid"] },
      default: "normal",
      label: "Justify Items",
      inputs: { inputType: "selection", options: ["normal", "start", "end", "center", "stretch"], default: "normal", format: "{value}" },
      format: "justify-items: {value};"
    },
    justifySelf: {
      requirement: { property: "display", value: ["grid", "inline-grid"] },
      default: "auto",
      label: "Justify Self",
      inputs: { inputType: "selection", options: ["auto", "start", "end", "center", "stretch"], default: "auto", format: "{value}" },
      format: "justify-self: {value};"
    },
    order: {
      requirement: { property: "display", value: ["flex", "grid", "inline-flex", "inline-grid"] },
      default: "0",
      label: "Order",
      inputs: { inputType: "number", default: "0", format: "{value}" },
      format: "order: {value};"
    },
    backgroundColor: {
      default: "transparent",
      label: "Background Color",
      inputs: { inputType: "selection", options: ["transparent", "{globalKeyword}", "{colorKeywords}", "{text}"], default: "transparent", format: "{value}" },
      format: "background-color: {value};"
    },
    border: {
      default: "none",
      label: "Border",
      inputs: { 
        inputType: "selection", 
        options: [
          "auto",
          "{globalKeyword}",
          "{borderList}"
        ], 
        default: "auto", 
        format: "{value}" 
      },
      format: "border: {value};"
    },
    borderWidth: {
      default: "0",
      label: "Border Width",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "border-width: {value};"
    },
    borderStyle: {
      default: "none",
      label: "Border Style",
      inputs: { inputType: "selection", options: ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset", "{globalKeyword}"], default: "none", format: "{value}" },
      format: "border-style: {value};"
    },
    borderColor: {
      default: "currentColor",
      label: "Border Color",
      inputs: { inputType: "selection", options: ["currentColor", "transparent", "{globalKeyword}", "{colorKeywords}"], default: "currentColor", format: "{value}" },
      format: "border-color: {value};"
    },
    borderRadius: {
      default: "0",
      label: "Border Radius",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "border-radius: {value};"
    },
    borderBottom: {
      default: "none",
      label: "Border Bottom",
      inputs: { 
        inputType: "selection", 
        options: [
          "auto",
          "{globalKeyword}",
          "{borderList}"
        ], 
        default: "auto", 
        format: "{value}" 
      },
      format: "border-bottom: {value};"
    },
    backdropFilter: {
      default: "none",
      label: "Backdrop Filter",
      inputs: { inputType: "selection", default: "{backdropFilterBlur}", format: "{value}" , options: ["none", "{backdropFilterBlur}", "{globalKeyword}"] },
      format: "backdrop-filter: blur({value});"
    }
};
