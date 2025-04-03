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
