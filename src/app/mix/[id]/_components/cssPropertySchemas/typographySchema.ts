export const cssTypographySchema = {
  color: {
    default: "inherit",
    label: "Color",
    inputs: { inputType: "selection", options: ["inherit", "{globalKeyword}", "{colorKeywords}"], default: "inherit", format: "{value}" },
    format: "color: {value};"
  },
  fontFamily: {
    default: "inherit",
    label: "Font Family",
    inputs: { 
      inputType: "selection", 
      options: [
        "inherit", 
        "{globalKeyword}", 
        "Arial, sans-serif", 
        "Helvetica, sans-serif", 
        "Times New Roman, serif", 
        "Georgia, serif", 
        "Courier New, monospace", 
        "Verdana, sans-serif", 
        "system-ui"
      ], 
      default: "inherit", 
      format: "{value}" 
    },
    format: "font-family: {value};"
  },
  fontSize: {
    default: "inherit",
    label: "Font Size",
    inputs: { 
      inputType: "selection", 
      options: ["inherit", "{globalKeyword}", "{dimension}", "small", "medium", "large", "x-large", "xx-large"], 
      default: "inherit", 
      format: "{value}" 
    },
    format: "font-size: {value};"
  },
  fontWeight: {
    default: "normal",
    label: "Font Weight",
    inputs: { 
      inputType: "selection", 
      options: ["normal", "bold", "lighter", "bolder", "100", "200", "300", "400", "500", "600", "700", "800", "900", "{globalKeyword}"], 
      default: "normal", 
      format: "{value}" 
    },
    format: "font-weight: {value};"
  },
  fontStyle: {
    default: "normal",
    label: "Font Style",
    inputs: { 
      inputType: "selection", 
      options: ["normal", "italic", "oblique", "{globalKeyword}"], 
      default: "normal", 
      format: "{value}" 
    },
    format: "font-style: {value};"
  },
  lineHeight: {
    default: "normal",
    label: "Line Height",
    inputs: { 
      inputType: "selection", 
      options: ["normal", "{globalKeyword}", "{dimension}", "1", "1.2", "1.5", "2"], 
      default: "normal", 
      format: "{value}" 
    },
    format: "line-height: {value};"
  },
  textAlign: {
    default: "left",
    label: "Text Align",
    inputs: { 
      inputType: "selection", 
      options: ["left", "center", "right", "justify", "start", "end", "{globalKeyword}"], 
      default: "left", 
      format: "{value}" 
    },
    format: "text-align: {value};"
  },
  letterSpacing: {
    default: "normal",
    label: "Letter Spacing",
    inputs: { 
      inputType: "selection", 
      options: ["normal", "{globalKeyword}", "{dimension}", "0.05em", "0.1em", "-0.05em"], 
      default: "normal", 
      format: "{value}" 
    },
    format: "letter-spacing: {value};"
  },
  wordSpacing: {
    default: "normal",
    label: "Word Spacing",
    inputs: { 
      inputType: "selection", 
      options: ["normal", "{globalKeyword}", "{dimension}", "0.05em", "0.1em", "0.2em"], 
      default: "normal", 
      format: "{value}" 
    },
    format: "word-spacing: {value};"
  },
  textDecoration: {
    default: "none",
    label: "Text Decoration",
    inputs: { 
      inputType: "selection", 
      options: ["none", "underline", "overline", "line-through", "{globalKeyword}"], 
      default: "none", 
      format: "{value}" 
    },
    format: "text-decoration: {value};"
  },
  textTransform: {
    default: "none",
    label: "Text Transform",
    inputs: { 
      inputType: "selection", 
      options: ["none", "capitalize", "uppercase", "lowercase", "{globalKeyword}"], 
      default: "none", 
      format: "{value}" 
    },
    format: "text-transform: {value};"
  },
  textIndent: {
    default: "0",
    label: "Text Indent",
    inputs: { 
      inputType: "selection", 
      options: ["{globalKeyword}", "{dimension}", "0", "1em", "2em"], 
      default: "0", 
      format: "{value}" 
    },
    format: "text-indent: {value};"
  },
  whiteSpace: {
    default: "normal",
    label: "White Space",
    inputs: { 
      inputType: "selection", 
      options: ["normal", "nowrap", "pre", "pre-wrap", "pre-line", "{globalKeyword}"], 
      default: "normal", 
      format: "{value}" 
    },
    format: "white-space: {value};"
  },
  textOverflow: {
    default: "clip",
    label: "Text Overflow",
    inputs: { 
      inputType: "selection", 
      options: ["clip", "ellipsis", "{globalKeyword}"], 
      default: "clip", 
      format: "{value}" 
    },
    format: "text-overflow: {value};"
  },
  verticalAlign: {
    default: "baseline",
    label: "Vertical Align",
    inputs: { 
      inputType: "selection", 
      options: ["baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom", "{globalKeyword}", "{dimension}"], 
      default: "baseline", 
      format: "{value}" 
    },
    format: "vertical-align: {value};"
  }
};
