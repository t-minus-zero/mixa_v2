# Database Migrations

This document outlines how to make schema changes to the Mixa database using Drizzle Kit.

## Migration Workflow with Drizzle Kit

Follow these steps when making database schema changes:

1. **Update the schema definition**:
   - Modify `/src/server/db/schema.ts` to reflect your database changes
   - For example, add new columns, tables, or modify existing ones

2. **Generate the migration SQL**:
   - Run the following command to generate migration SQL:
   ```bash
   npx drizzle-kit generate
   ```
   - This creates SQL files in the `drizzle` directory

3. **Apply the migration to your database**:
   - Run the following command to push changes to your database:
   ```bash
   npx drizzle-kit push
   ```
   - This connects to your cloud database using the credentials in `drizzle.config.ts`

4. **Update tRPC routers**:
   - Update any tRPC routers that interact with the modified tables
   - Update input/output types to include new fields
   - Ensure TypeScript types are correct

5. **Update UI components** (if needed):
   - Update any UI components to use the new fields

## Recent Migrations

- **2025-03-23**: Added name field to mixes table (SQL file: `drizzle/0001_fair_omega_sentinel.sql`)

## Drizzle Kit Documentation

For more information on Drizzle Kit migrations, see:
- https://orm.drizzle.team/kit-docs/overview
- https://orm.drizzle.team/kit-docs/commands

## Safety Notes

- Drizzle Kit migrations are designed to be non-destructive
- When adding columns, make them nullable initially to maintain compatibility with existing data
- Always back up your database before running migrations in production
- Preview changes with `drizzle-kit generate` before applying them with `drizzle-kit push`
