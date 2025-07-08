import { cssDisplaySchema } from './css/display';
import { cssPositionSchema } from './css/position';
import { cssTypographySchema } from './css/typography';
import { pseudoClassesSchema } from './css/pseudoClasses';

// Combine all CSS properties into a single schema
export const cssSchema = {
  ...cssDisplaySchema,
  ...cssPositionSchema,
  ...cssTypographySchema
};

// Export pseudo-classes schema separately (operates at class level, not property level)
export { pseudoClassesSchema };
