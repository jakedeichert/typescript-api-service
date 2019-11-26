import { createTestServer } from '../../../test/server';

const testServer = createTestServer();

describe('example controller', () => {
    describe('POST /example/bodySchema', () => {
        test('returns the ctx.state.body', async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                email: 'cave@aperturescience.com',
                password: 'glados_was_here',
            });
            expect(resp.body.data).toStrictEqual({
                email: 'cave@aperturescience.com',
                password: 'glados_was_here',
            });
            expect(resp.status).toBe(200);
        });

        test('errors when email is not valid', async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                email: 'caveaperturescience.com',
                password: 'glados_was_here',
            });
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"email" must be a valid email',
            });
            expect(resp.status).toBe(400);
        });

        test('errors when email is empty', async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                email: '',
                password: 'glados_was_here',
            });
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"email" is not allowed to be empty',
            });
            expect(resp.status).toBe(400);
        });

        test(`errors when email wasn't supplied`, async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                password: 'glados_was_here',
            });
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"email" is required',
            });
            expect(resp.status).toBe(400);
        });

        test('errors when password is too short', async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                email: 'cave@aperturescience.com',
                password: 'short',
            });
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"password" length must be at least 8 characters long',
            });
            expect(resp.status).toBe(400);
        });

        test('errors when password is empty', async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                email: 'cave@aperturescience.com',
                password: '',
            });
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"password" is not allowed to be empty',
            });
            expect(resp.status).toBe(400);
        });

        test(`errors when password wasn't supplied`, async () => {
            const resp = await testServer.api.post('/example/bodySchema').send({
                email: 'cave@aperturescience.com',
            });
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"password" is required',
            });
            expect(resp.status).toBe(400);
        });
    });

    describe('POST /example/querySchema', () => {
        test('returns the ctx.state.query', async () => {
            const query = ['name=cave', 'age=50'].join('&');
            const resp = await testServer.api.get(
                `/example/querySchema?${query}`
            );
            expect(resp.body.data).toStrictEqual({
                age: 50,
                name: 'cave',
            });
            expect(resp.status).toBe(200);
        });

        test('errors when name is empty', async () => {
            const query = ['name=', 'age=50'].join('&');
            const resp = await testServer.api.get(
                `/example/querySchema?${query}`
            );
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"name" is not allowed to be empty',
            });
            expect(resp.status).toBe(400);
        });

        test(`errors when name wasn't supplied`, async () => {
            const query = 'age=50';
            const resp = await testServer.api.get(
                `/example/querySchema?${query}`
            );
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"name" is required',
            });
            expect(resp.status).toBe(400);
        });

        test('errors age is not a number', async () => {
            const query = ['name=cave', 'age=abc'].join('&');
            const resp = await testServer.api.get(
                `/example/querySchema?${query}`
            );
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"age" must be a number',
            });
            expect(resp.status).toBe(400);
        });

        test('errors when age is empty', async () => {
            const query = ['name=cave', 'age='].join('&');
            const resp = await testServer.api.get(
                `/example/querySchema?${query}`
            );
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"age" must be a number',
            });
            expect(resp.status).toBe(400);
        });

        test(`errors when age wasn't supplied`, async () => {
            const query = 'name=cave';
            const resp = await testServer.api.get(
                `/example/querySchema?${query}`
            );
            expect(resp.body).toStrictEqual({
                err: true,
                msg: '"age" is required',
            });
            expect(resp.status).toBe(400);
        });
    });
});
