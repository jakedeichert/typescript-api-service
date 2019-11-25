/* eslint-disable no-console */
import { PORT, LOG_LEVEL } from './config';
import { buildServer } from './server';
import { initLogger, logger } from '@/logger';
import { initDb } from './db';

async function init(): Promise<void> {
    try {
        initLogger(LOG_LEVEL);

        // Initialize the database client and run migrations
        await initDb();

        // Start the server
        buildServer().listen(PORT);
        logger.info(`Service running on port ${PORT}`);
    } catch (err) {
        logger.error('Failed to start the service');
        console.error(err);
        process.exit(1);
    }
}

init();
