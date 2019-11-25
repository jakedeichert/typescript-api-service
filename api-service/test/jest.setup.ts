import { closeConnection } from '@/db-utils/dist/client';
import { initSystems } from './bootup';

let hasRun = false;

// Runs once before the entire test suite.
export default async function(): Promise<void> {
    // When running test:watch, we don't need to rerun migrations.
    if (hasRun) return Promise.resolve();
    hasRun = true;
    await initSystems();
    await closeConnection();
}
