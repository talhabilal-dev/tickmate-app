import { drizzle } from 'drizzle-orm/node-postgres';
import { ENV } from './env.config.js';
if (!ENV.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}



export const db = drizzle(ENV.DATABASE_URL);

// export const db = drizzle({
//   connection: {
//     connectionString: ENV.DATABASE_URL,
//     ssl: true, 
//   }
// });
