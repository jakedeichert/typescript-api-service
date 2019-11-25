import { createTestServer } from '../../../test/server';

const prefix = '/health';
const testServer = createTestServer();

describe('health controller', () => {
    describe('GET /health', () => {
        test('returns 200', async () => {
            const response = await testServer.api.get(prefix);
            expect(response.status).toBe(200);
        });
    });

    describe('GET /health/extensive', () => {
        test('returns 200', async () => {
            const response = await testServer.api.get(`${prefix}/extensive`);
            expect(response.status).toBe(200);
        });

        test('returns health status', async () => {
            const response = await testServer.api.get(`${prefix}/extensive`);
            expect(response.body.data).toStrictEqual({
                db: true,
            });
        });
    });
});
