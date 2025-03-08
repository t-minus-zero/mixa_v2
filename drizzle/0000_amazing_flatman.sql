CREATE TABLE IF NOT EXISTS "mixa_mix" (
	"id" serial PRIMARY KEY NOT NULL,
	"json_content" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mixa_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(128),
	"description" varchar(512),
	"author" varchar(128),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "mixa_post" ("title");