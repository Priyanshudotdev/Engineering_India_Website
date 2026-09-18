import { db } from "@/database/db";
import {
  account,
  session,
  user,
  verification,
} from "@/database/schema/auth-schema";
import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: user,
      session: session,
      verification: verification,
      account: account,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
      },
    },
  },
});
