export const cssPositionSchema = {
    position: {
      default: "relative",
      label: "Position",
      inputs: { inputType: "option", options: ["static", "relative", "absolute", "fixed", "sticky"], default: "relative", format: "{value}" },
      format: "position: {value};"
    },
    top: {
      requirement: { property: "position", value: ["absolute", "fixed", "sticky"] },
      default: "0",
      label: "Top",
      inputs: { inputType: "selection", options: ["auto","{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "top: {value};"
    },
    right: {
      requirement: { property: "position", value: ["absolute", "fixed", "sticky"] },
      default: "0",
      label: "Right",
      inputs: { inputType: "selection", options: ["auto","{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "right: {value};"
    },
    bottom: {
      requirement: { property: "position", value: ["absolute", "fixed", "sticky"] },
      default: "0",
      label: "Bottom",
      inputs: { inputType: "selection", options: ["auto","{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "bottom: {value};"
    },
    left: {
      requirement: { property: "position", value: ["absolute", "fixed", "sticky"] },
      default: "0",
      label: "Left",
      inputs: { inputType: "selection", options: ["auto","{globalKeyword}", "{dimension}"], default: "{dimension}", format: "{value}" },
      format: "left: {value};"
    },
    width: {
      default: "auto",
      label: "Width",
      inputs: { inputType: "option", options: ["auto", "{globalKeyword}", "{dimension}", "fit-content", "max-content", "min-content"], default: "auto", format: "{value}" },
      format: "width: {value};"
    },
    height: {
      default: "auto",
      label: "Height",
      inputs: { inputType: "option", options: ["auto", "{globalKeyword}", "{dimension}", "fit-content", "max-content", "min-content"], default: "auto", format: "{value}" },
      format: "height: {value};"
    },
    minWidth: {
      default: "0",
      label: "Min Width",
      inputs: { inputType: "selection", options: ["auto", "{globalKeyword}", "{dimension}", "fit-content", "max-content", "min-content"], default: "0", format: "{value}" },
      format: "min-width: {value};"
    },
    minHeight: {
      default: "0",
      label: "Min Height",
      inputs: { inputType: "selection", options: ["auto", "{globalKeyword}", "{dimension}", "fit-content", "max-content", "min-content"], default: "0", format: "{value}" },
      format: "min-height: {value};"
    },
    maxWidth: {
      default: "none",
      label: "Max Width",
      inputs: { inputType: "selection", options: ["none", "{globalKeyword}", "{dimension}", "fit-content", "max-content", "min-content"], default: "none", format: "{value}" },
      format: "max-width: {value};"
    },
    maxHeight: {
      default: "none",
      label: "Max Height",
      inputs: { inputType: "selection", options: ["none", "{globalKeyword}", "{dimension}", "fit-content", "max-content", "min-content"], default: "none", format: "{value}" },
      format: "max-height: {value};"
    },
    zIndex: {
      requirement: { property: "position", value: ["relative", "absolute", "fixed", "sticky"] },
      default: "auto",
      label: "Z-Index",
      inputs: { inputType: "selection", options: ["auto", "{globalKeyword}", "0", "1", "10", "100", "1000", "-1", "-10"], default: "auto", format: "{value}" },
      format: "z-index: {value};"
    },
    opacity: {
      default: "1",
      label: "Opacity",
      inputs: { inputType: "selection", options: ["{globalKeyword}", "{number}"], default: "{number}", format: "{value}" },
      format: "opacity: {value};"
    },
    visibility: {
      default: "visible",
      label: "Visibility",
      inputs: { inputType: "selection", options: ["visible", "hidden", "collapse", "{globalKeyword}"], default: "visible", format: "{value}" },
      format: "visibility: {value};"
    },
    overflow: {
      default: "visible",
      label: "Overflow",
      inputs: { inputType: "option", options: ["visible", "hidden", "scroll", "auto", "{globalKeyword}"], default: "visible", format: "{value}" },
      format: "overflow: {value};"
    },
    overflowX: {
      default: "visible",
      label: "Overflow X",
      inputs: { inputType: "selection", options: ["visible", "hidden", "scroll", "auto", "{globalKeyword}"], default: "visible", format: "{value}" },
      format: "overflow-x: {value};"
    },
    overflowY: {
      default: "visible",
      label: "Overflow Y",
      inputs: { inputType: "selection", options: ["visible", "hidden", "scroll", "auto", "{globalKeyword}"], default: "visible", format: "{value}" },
      format: "overflow-y: {value};"
    },
    scrollBehavior: {
      default: "auto",
      label: "Scroll Behavior",
      inputs: { inputType: "selection", options: ["auto", "smooth", "{globalKeyword}"], default: "auto", format: "{value}" },
      format: "scroll-behavior: {value};"
    },
    scrollSnapType: {
      default: "none",
      label: "Scroll Snap Type",
      inputs: { inputType: "selection", options: ["none", "x mandatory", "y mandatory", "x proximity", "y proximity", "both mandatory", "both proximity", "{globalKeyword}"], default: "none", format: "{value}" },
      format: "scroll-snap-type: {value};"
    },
    scrollSnapAlign: {
      default: "none",
      label: "Scroll Snap Align",
      inputs: { inputType: "selection", options: ["none", "start", "end", "center", "{globalKeyword}"], default: "none", format: "{value}" },
      format: "scroll-snap-align: {value};"
    },
    scrollSnapStop: {
      default: "normal",
      label: "Scroll Snap Stop",
      inputs: { inputType: "selection", options: ["normal", "always", "{globalKeyword}"], default: "normal", format: "{value}" },
      format: "scroll-snap-stop: {value};"
    },
    padding: {
      default: "0",
      label: "Padding",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}", "{individual}"], default: "{dimension}", format: "{value}" },
      format: "padding: {value};"
    },
    paddingTop: {
      default: "0",
      label: "Padding Top",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "padding-top: {value};"
    },
    paddingRight: {
      default: "0",
      label: "Padding Right",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "padding-right: {value};"
    },
    paddingBottom: {
      default: "0",
      label: "Padding Bottom",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "padding-bottom: {value};"
    },
    paddingLeft: {
      default: "0",
      label: "Padding Left",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "padding-left: {value};"
    },
    margin: {
      default: "0",
      label: "Margin",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}", "{individual}"], default: "{dimension}", format: "{value}" },
      format: "margin: {value};"
    },
    marginTop: {
      default: "0",
      label: "Margin Top",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "margin-top: {value};"
    },
    marginRight: {
      default: "0",
      label: "Margin Right",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "margin-right: {value};"
    },
    marginBottom: {
      default: "0",
      label: "Margin Bottom",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "margin-bottom: {value};"
    },
    marginLeft: {
      default: "0",
      label: "Margin Left",
      inputs: { inputType: "selection", options: ["{globalKeyword}","auto","{dimension}"], default: "{dimension}", format: "{value}" },
      format: "margin-left: {value};"
    },
    boxSizing: {
      default: "content-box",
      label: "Box Sizing",
      inputs: { inputType: "selection", options: ["content-box", "border-box"], default: "content-box", format: "{value}" },
      format: "box-sizing: {value};"
    }
};
