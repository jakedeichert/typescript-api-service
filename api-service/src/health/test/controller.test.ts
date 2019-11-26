import { createTestServer } from '../../../test/server';

const testServer = createTestServer();

describe('health controller', () => {
    describe('GET /health', () => {
        test('returns 200', async () => {
            const resp = await testServer.api.get('/health');
            expect(resp.status).toBe(200);
        });
    });

    describe('GET /health/extensive', () => {
        test('returns 200', async () => {
            const resp = await testServer.api.get('/health/extensive');
            expect(resp.status).toBe(200);
        });

        test('returns health status', async () => {
            const resp = await testServer.api.get('/health/extensive');
            expect(resp.body.data).toStrictEqual({
                db: true,
            });
        });
    });
});
