// CSS Schema definition
export const cssSchema = {
  definitions: {
    // Basic patterns and reusable types:
    numeric: {
      pattern: "^-?[0-9]+(\\.[0-9]+)?$",
      description: "A number (integer or decimal), possibly negative"
    },
    lengthUnit: {
      enum: ["px", "%", "rem", "em", "vh", "vw", "fr"],
      description: "Valid CSS length units"
    },
    dimension: {
      pattern: "^-?[0-9]+(\\.[0-9]+)?(px|%|rem|em|vh|vw|fr)$",
      description: "A CSS dimension, e.g., 10px or -1.5rem"
    },
    autoKeyword: {
      pattern: "^auto$",
      description: "The keyword 'auto'"
    },
    hexColor: {
      pattern: "^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$",
      description: "A hexadecimal color, e.g., #fff or #ffffff"
    },
    rgbColor: {
      pattern: "^rgb\\((\\s*\\d+\\s*,){2}\\s*\\d+\\s*\\)$",
      description: "An RGB color, e.g., rgb(255, 255, 255)"
    },
    colorValue: {
      oneOf: [
        { "$ref": "#/definitions/hexColor" },
        { "$ref": "#/definitions/rgbColor" }
      ],
      description: "A valid CSS color"
    }
  },

  properties: {
    // Box-model properties
    margin: {
      group: "position",
      default: "0px",
      inputs: {
        auto: { "$ref": "#/definitions/autoKeyword" },
        dimension: { "$ref": "#/definitions/dimension" }
      },
      structures: {
        single: true,
        dual: true,
        individual: true
      }
    },
    padding: {
      group: "position",
      default: "0px",
      inputs: {
        dimension: { "$ref": "#/definitions/dimension" }
      },
      structures: {
        single: true,
        dual: true,
        individual: true
      }
    },
    borderWidth: {
      group: "border",
      default: "medium",
      inputs: {
        none: { pattern: "^none$" },
        dimension: { "$ref": "#/definitions/dimension" }
      },
      structures: {
        single: true
      }
    },

    // Display & Layout properties
    display: {
      group: "layout",
      default: "block",
      inputs: {
        select: { pattern: "^(block|inline|inline-block|flex|grid|none)$" }
      },
      structures: {
        select: true
      }
    },

    // Flex properties
    flexDirection: {
      group: "layout",
      parentProperty: "display",
      default: "row",
      inputs: {
        select: { pattern: "^(row|column|row-reverse|column-reverse)$" }
      },
      structures: {
        select: true
      }
    },
    justifyContent: {
      group: "layout",
      parentProperty: "display",
      default: "flex-start",
      inputs: {
        select: { pattern: "^(flex-start|flex-end|center|space-between|space-around|space-evenly)$" }
      },
      structures: {
        select: true
      }
    },
    alignItems: {
      group: "layout",
      parentProperty: "display",
      default: "stretch",
      inputs: {
        select: { pattern: "^(flex-start|flex-end|center|baseline|stretch)$" }
      },
      structures: {
        select: true
      }
    },
    flexWrap: {
      group: "layout",
      parentProperty: "display",
      default: "nowrap",
      inputs: {
        select: { pattern: "^(nowrap|wrap|wrap-reverse)$" }
      },
      structures: {
        select: true
      }
    },
    gap: {
      group: "layout",
      parentProperty: "display",
      default: "0px",
      inputs: {
        dimension: { "$ref": "#/definitions/dimension" }
      },
      structures: {
        single: true
      }
    },

    // Typography properties
    fontFamily: {
      group: "typography",
      default: "sans-serif",
      inputs: {
        select: {
          pattern: "^(sans-serif|serif|monospace|cursive|fantasy)$"
        }
      },
      structures: {
        select: true
      }
    },
    fontSize: {
      group: "typography",
      default: "16px",
      inputs: {
        dimension: { "$ref": "#/definitions/dimension" }
      },
      structures: {
        single: true
      }
    },
    fontWeight: {
      group: "typography",
      default: "400",
      inputs: {
        select: { pattern: "^(100|200|300|400|500|600|700|800|900|normal|bold)$" }
      },
      structures: {
        select: true
      }
    },
    fontStyle: {
      group: "typography",
      default: "normal",
      inputs: {
        select: { pattern: "^(normal|italic|oblique)$" }
      },
      structures: {
        select: true
      }
    },
    lineHeight: {
      group: "typography",
      default: "normal",
      inputs: {
        select: { pattern: "^(normal)$" },
        manual: { pattern: "^-?[0-9]+(\\.[0-9]+)?$" }
      },
      structures: {
        select: true
      }
    },

    // Grid properties
    gridTemplateColumns: {
      group: "layout",
      parentProperty: "display",
      default: "none",
      inputs: {
        template: { pattern: "^(none|auto|max-content|min-content|(repeat\\([0-9]+,\\s*([0-9]+fr|auto)\\)))$" }
      },
      structures: {
        select: true
      }
    },
    gridTemplateRows: {
      group: "layout",
      parentProperty: "display",
      default: "none",
      inputs: {
        template: { pattern: "^(none|auto|max-content|min-content|(repeat\\([0-9]+,\\s*([0-9]+fr|auto)\\)))$" }
      },
      structures: {
        select: true
      }
    },
    gridGap: {
      group: "layout",
      parentProperty: "display",
      default: "0px",
      inputs: {
        dimension: { "$ref": "#/definitions/dimension" }
      },
      structures: {
        single: true
      }
    },
    gridColumn: {
      group: "layout",
      parentProperty: "display",
      default: "auto",
      inputs: {
        select: { pattern: "^(auto|[0-9]+|span)$" }
      },
      structures: {
        select: true
      }
    },
    gridRow: {
      group: "layout",
      parentProperty: "display",
      default: "auto",
      inputs: {
        select: { pattern: "^(auto|[0-9]+|span)$" }
      },
      structures: {
        select: true
      }
    },
    color: {
      group: "typography",
      default: "#000000",
      inputs: {
        color: { "$ref": "#/definitions/colorValue" }
      },
      structures: {
        single: true
      }
    },

    // Background properties
    backgroundColor: {
      group: "appearance",
      default: "transparent",
      inputs: {
        color: { "$ref": "#/definitions/colorValue" }
      },
      structures: {
        single: true
      }
    }
  }
} as const;
