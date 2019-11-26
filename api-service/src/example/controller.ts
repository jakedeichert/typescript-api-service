import { Context } from '@/http-utils';
import { Method, HandlerConfig, validator } from '@/http-utils/dist/controller';
import { response, HttpResponse } from '@/http-utils/dist/response';

async function bodySchemaTest(ctx: Context): HttpResponse {
    ctx.logger.info(`body value ${JSON.stringify(ctx.state.body)}`);
    return response().json({
        ...ctx.state.body,
    });
}

async function querySchemaTest(ctx: Context): HttpResponse {
    ctx.logger.info(`query value ${JSON.stringify(ctx.state.query)}`);
    return response().json({
        ...ctx.state.query,
    });
}

export function endpoints(): HandlerConfig[] {
    const prefix = '/example';
    return [
        {
            method: Method.Post,
            route: `${prefix}/bodySchema`,
            handler: bodySchemaTest,
            bodySchema: {
                email: validator()
                    .string()
                    .email()
                    .required(),
                password: validator()
                    .string()
                    .min(8)
                    .required(),
            },
        },
        {
            method: Method.Get,
            route: `${prefix}/querySchema`,
            handler: querySchemaTest,
            querySchema: {
                name: validator()
                    .string()
                    .required(),
                age: validator()
                    .number()
                    .required(),
            },
        },
    ];
}
