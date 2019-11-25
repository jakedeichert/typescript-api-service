import { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } from './config';
import { createClient, testConnection } from '@/db-utils/dist/client';
import { runMigrations } from '@/db-utils/dist/migrate';

export async function initDb(): Promise<void> {
    // Create the knex client and connection pool.
    createClient(DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME);

    // If the connection fails, an error is thrown and the service will not start.
    await testConnection();

    // Run any new migrations.
    await runMigrations();
}
