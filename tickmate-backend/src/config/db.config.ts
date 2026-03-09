import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { ENV } from './env.config.js';

if (!ENV.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sql = neon(ENV.DATABASE_URL);

const db = drizzle({ client: sql });


export default db;