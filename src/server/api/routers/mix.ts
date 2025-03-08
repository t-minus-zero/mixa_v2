import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "MixaDev/server/api/trpc";
import { mixes } from "MixaDev/server/db/schema";
import { eq } from 'drizzle-orm/expressions';

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
      // No need to parse the JSON content, it is already an object
      const parsedContent = mix.jsonContent;
      // Return the parsed content along with the mix ID
      return {
        id: mix.id,
        jsonContent: parsedContent,
      };
    } catch (error) {
      throw new Error('Failed to fetch mix');
    }
  }),

  // Procedure to create a new mix
  createMix: publicProcedure
    .input(z.object({ jsonContent: z.object({
      id: z.string(),
      tag: z.string(),
      title: z.string(),
      classes: z.array(z.string()),
      style: z.array(z.any()),
      content: z.string(),
      childrens: z.array(z.any())
    }) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const jsonString = stringifyObject(input.jsonContent);
        const result = await ctx.db.insert(mixes).values({
          jsonContent: jsonString,
        }).returning();
        return result;
      } catch (error) {
        throw new Error('Failed to create mix');
      }
    }),


  replaceMixById: publicProcedure
    .input(z.object({
      id: z.number(),
      jsonContent: z.object({
        treeData: z.object({
          id: z.string(),
          tag: z.string(),
          title: z.string(),
          classes: z.array(z.string()),
          style: z.array(z.any()),
          content: z.string(),
          childrens: z.array(z.any())
        }),
        cssData: z.object({
          classes: z.record(z.string(), z.any())
        })
      })
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
          const result = await ctx.db
            .update(mixes)
            .set({
              jsonContent: stringifyObject(input.jsonContent)
            })
            .where(eq(mixes.id, input.id))
            .returning();

          console.log('Updated mix:', result);
          return result;
        } else {
          // Insert a new mix
          const result = await ctx.db
            .insert(mixes)
            .values({
              id: input.id,
              jsonContent: stringifyObject(input.jsonContent)
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
