// Types for CSS property definitions
export interface CSSDefinition {
  pattern?: string;
  description?: string;
  enum?: string[];
  oneOf?: CSSDefinition[];
  $ref?: string;
}

export interface CSSInputDefinition {
  auto?: CSSDefinition;
  dimension?: CSSDefinition;
  color?: CSSDefinition;
  select?: CSSDefinition;
  template?: CSSDefinition;
  none?: CSSDefinition;
  gap?: CSSDefinition;
  manual?: CSSDefinition;
}

export interface CSSStructure {
  all?: string[];
  vertical?: string[];
  horizontal?: string[];
  top?: string[];
  right?: string[];
  bottom?: string[];
  left?: string[];
  select?: string;
}

export interface CSSPropertyDefinition {
  group: string;
  default: string;
  parentProperty?: string;
  inputs: CSSInputDefinition;
  structures: {
    single?: CSSStructure | string;
    dual?: CSSStructure;
    individual?: CSSStructure;
    select?: CSSStructure;
  };
}
