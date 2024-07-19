import { type Config } from "drizzle-kit";

import { env } from "MixaDev/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["mixa_*"],
} satisfies Config;
