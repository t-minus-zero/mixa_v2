import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "MixaDev/server/api/trpc";
import { mixes } from "MixaDev/server/db/schema";
import { eq } from 'drizzle-orm/expressions';

// Define Zod schemas for validation

// CSS Value Node schema
const cssValueNodeSchema = z.object({
  id: z.string(),
  name: z.string().optional(), // Made name optional to match the current structure
  value: z.any(),
  type: z.string().optional(),
  category: z.string().optional(), // Optional category for pseudo-class/screen grouping
});

// CSS Category Node schema
const cssCategoryNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  value: z.any(),
});

// CSS Class schema
const cssClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  properties: z.array(cssValueNodeSchema),
  categories: z.array(cssCategoryNodeSchema), // Array of category nodes
});

// CSS Tree schema
const cssTreeSchema = z.object({
  classes: z.array(cssClassSchema)
});

// Tree Node schema
const treeNodeSchema = z.object({
  id: z.string(),
  tag: z.string(),
  title: z.string(),
  classes: z.array(z.string()),
  style: z.array(z.any()),
  content: z.string(),
  childrens: z.array(z.any().optional())
});

// Mix JSON Content schema
const mixJsonContentSchema = z.object({
  version: z.number(),
  treeData: treeNodeSchema,
  cssData: cssTreeSchema
});

// Utility functions for JSON handling
function stringifyObject(obj: object): string {
  try {
    console.log('Attempting to stringify object:', obj);
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Failed to stringify object:', obj, 'Error:', error);
    throw new Error('Invalid object format');
  }
}

export const mixRouter = createTRPCRouter({
  // Procedure to get all mixes
  getAllMixes: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const result = await ctx.db
          .select()
          .from(mixes)
          .orderBy(mixes.id);
        return result;
      } catch (error) {
        throw new Error('Failed to fetch mixes');
      }
    }),
  // Procedure to fetch a mix by ID
  getMixById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx, input }) => {
    try {
      // Fetching the mix from the database using the ID
      const result = await ctx.db
        .select()
        .from(mixes)
        .where(eq(mixes.id, input.id));

      // Check if the mix was found
      if (result.length === 0) {
        throw new Error(`Mix with id ${input.id} not found`);
      }
      // Get the first item from the result array
      const mix = result[0];
      
      // Ensure mix exists (we've already checked result.length above, but this satisfies TypeScript)
      if (!mix) {
        throw new Error(`Mix with id ${input.id} not found`);
      }
      
      // No need to parse the JSON content, it is already an object
      const parsedContent = mix.jsonContent;
      
      // Return the parsed content along with all mix metadata
      return {
        id: mix.id,
        name: mix.name,
        mixType: mix.mixType,
        createdAt: mix.createdAt,
        updatedAt: mix.updatedAt,
        jsonContent: parsedContent,
      };
    } catch (error) {
      throw new Error('Failed to fetch mix');
    }
  }),

  // Procedure to create a new mix
  createMix: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      mixType: z.string().optional(),
      jsonContent: mixJsonContentSchema
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const jsonString = stringifyObject(input.jsonContent);
        const now = new Date();
        const result = await ctx.db.insert(mixes).values({
          name: input.name ?? "New Mix",
          mixType: input.mixType ?? "webpage",
          jsonContent: jsonString,
          createdAt: now,
          updatedAt: now,
        }).returning();
        return result;
      } catch (error) {
        throw new Error('Failed to create mix');
      }
    }),


  replaceMixById: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      mixType: z.string().optional(),
      jsonContent: mixJsonContentSchema
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the mix exists
        const existingMix = await ctx.db
          .select()
          .from(mixes)
          .where(eq(mixes.id, input.id));

        if (existingMix.length > 0) {
          // Update the existing mix
          const now = new Date();
          const result = await ctx.db
            .update(mixes)
            .set({
              name: input.name ?? "New Mix",
              mixType: input.mixType,
              jsonContent: stringifyObject(input.jsonContent),
              updatedAt: now
            })
            .where(eq(mixes.id, input.id))
            .returning();

          console.log('Updated mix:', result);
          return result;
        } else {
          // Insert a new mix
          const now = new Date();
          const result = await ctx.db
            .insert(mixes)
            .values({
              id: input.id,
              name: input.name ?? "New Mix",
              mixType: input.mixType ?? "webpage",
              jsonContent: stringifyObject(input.jsonContent),
              createdAt: now,
              updatedAt: now
            })
            .returning();

          console.log('Inserted new mix:', result);
          return result;
        }
      } catch (error) {
        console.error('Error replacing/creating mix:', error);
        throw new Error('Failed to replace/create mix');
      }
    }),

    
});
