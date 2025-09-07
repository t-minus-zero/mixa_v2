// Define the tree node structure
export interface TreeNode {
  id: string;
  tag: string;
  title: string;
  classes: string[];
  style: Array<{ className: string }>;
  inlineStyle?: Record<string, string>;
  content: string;
  attributes?: Array<{attribute: string, value: string}>;
  childrens: TreeNode[];
}

// Define position types for drag and drop operations
export type DropPosition = 'before' | 'after' | 'inside';

// CSS Types

// Base type for any CSS value node (property or nested value)
export interface CssValueNode {
  id: string;
  type: string;
  value: CssValue;
  category?: string; // Optional category for pseudo-class/screen grouping
}

// CSS value can be a primitive, object, or array
export type CssValue = string | number | CssValueNode | CssValueNode[];

// CSS Category Node (for pseudo-classes, screens, etc.)
export interface CssCategoryNode {
  id: string;
  type: string;
  value: CssValue;
}

// CSS Class
export interface CssClass {
  id: string;
  name: string;
  properties: CssValueNode[];
  categories: CssCategoryNode[]; // Array of category nodes (pseudo-classes, screens, etc.)
}

// CSS Tree Structure
export interface CssTree {
  classes: CssClass[];
}
