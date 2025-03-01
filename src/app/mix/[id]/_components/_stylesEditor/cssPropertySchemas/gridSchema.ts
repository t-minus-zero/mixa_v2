export const cssGridSchema = {
  name: "grid",
  dependency: {
    property: "display",
    value: "grid"
  },
  properties: {
    gridTemplateColumns: {
      default: "none",
      label: "Columns",
      inputs: ["globalKeyword", "trackKeyword", "trackList"],
      format: "grid-template-columns: {value};"
    },
  
    gridTemplateRows: {
      default: "none",
      label: "Rows",
      inputs: ["globalKeyword", "trackKeyword", "trackList"],
      format: "grid-template-rows: {value};"
    }
  }
};
