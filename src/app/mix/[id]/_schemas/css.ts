import { cssDisplaySchema } from './css/display';
import { cssPositionSchema } from './css/position';
import { cssTypographySchema } from './css/typography';

// Combine all CSS properties into a single schema
export const cssSchema = {
  ...cssDisplaySchema,
  ...cssPositionSchema,
  ...cssTypographySchema
};
