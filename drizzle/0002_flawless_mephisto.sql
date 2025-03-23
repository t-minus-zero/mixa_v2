ALTER TABLE "mixa_mix" ADD COLUMN "mixType" varchar(64) DEFAULT 'webpage';--> statement-breakpoint
ALTER TABLE "mixa_mix" ADD COLUMN "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "mixa_mix" ADD COLUMN "updatedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "mixa_mix" ADD COLUMN "deletedAt" timestamp with time zone;