export const cssGridSchema = {
    gridTemplateColumns: {
      default: "none",
      label: "Columns",
      inputs: { type: "selection", options: ["{globalKeyword}", "{trackKeyword}", "{trackList}"], default: "{fraction}", format: "{value}" },
      format: "grid-template-columns: {value};"
    },
    gridTemplateRows: {
      default: "none",
      label: "Rows",
      inputs: { type: "selection", options: ["{globalKeyword}", "{trackKeyword}", "{trackList}"], default: "{fraction}", format: "{value}" },
      format: "grid-template-rows: {value};"
    },
    gridGap: {
      default: "0",
      label: "Gap",
      inputs: { type: "selection", options: ["{globalKeyword}", "{dimension}"], default: "{fraction}", format: "{value}" },
      format: "grid-gap: {value};"
    }
};
