import dotenv from "dotenv";

dotenv.config();

type EnvConfig = {
  PORT: string | number;
  JWT_SECRET: string | undefined;
  DATABASE_URL: string | undefined;
  INNGEST_EVENT_KEY: string | undefined;
  GEMINI_API_KEY: string | undefined;
  INNGEST_SIGNING_KEY: string | undefined;
  RESEND_API_KEY: string | undefined;
  COOKIE_DOMAIN: string | undefined;
  APP_URL: string | undefined;
  NODE_ENV: string | undefined;
  EMAIL_FROM: string | undefined;
};

export const ENV: EnvConfig = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  APP_URL: process.env.APP_URL,
  NODE_ENV: process.env.NODE_ENV,
  EMAIL_FROM: process.env.EMAIL_FROM,
};

