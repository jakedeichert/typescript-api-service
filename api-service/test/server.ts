import { getControllers, getMiddleware } from '../src/server';
import { initSystems } from './bootup';
import { createServer } from '@/http-utils/dist/server';
import {
    TestContext,
    TestServer,
    testDbTxnMiddleware,
    createTestServer as newTestServer,
} from '@/http-utils/dist/test-utils';

export { createTestContext } from '@/http-utils/dist/test-utils';

export function createTestServer(testContext?: TestContext): TestServer {
    return newTestServer(ctx => {
        const middleware = [testDbTxnMiddleware(ctx), ...getMiddleware()];
        return createServer(getControllers(), middleware);
    }, testContext);
}

beforeAll(async () => {
    // Boot up all required systems (logger, db, etc...)
    await initSystems();
});
