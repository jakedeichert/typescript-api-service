import koaBodyParser from 'koa-bodyparser';
import { MiddlewareHandler } from '../middleware';
import { boom } from '../index';

export default (requestBodyMbLimit: number): MiddlewareHandler => {
    return koaBodyParser({
        jsonLimit: `${requestBodyMbLimit}mb`,
        strict: true,
        onerror: err => {
            throw boom.badRequest(`Failed to parse json body: ${err.message}`);
        },
    });
};
