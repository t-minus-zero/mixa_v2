// Server-side data utilities
import { db } from '../../server/db';
import { mixes } from '../../server/db/schema';
import { eq, desc } from 'drizzle-orm';

// Define types for mixes based on our database schema
export interface Mix {
  id: number;
  name: string | null;
  mixType: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  jsonContent?: unknown;
}

// Get all mixes
export async function getAllMixes(): Promise<Mix[]> {
  try {
    const result = await db
      .select()
      .from(mixes)
      .orderBy(desc(mixes.updatedAt));
    return result;
  } catch (error) {
    console.error('Failed to fetch mixes:', error);
    throw new Error('Failed to fetch mixes');
  }
}

// Get a mix by ID
export async function getMixById(id: number): Promise<Mix | null> {
  try {
    const result = await db
      .select()
      .from(mixes)
      .where(eq(mixes.id, id))
      .limit(1);
    
    return result.length > 0 ? result[0] as Mix : null;
  } catch (error) {
    console.error(`Failed to fetch mix with ID ${id}:`, error);
    throw new Error(`Failed to fetch mix with ID ${id}`);
  }
}
