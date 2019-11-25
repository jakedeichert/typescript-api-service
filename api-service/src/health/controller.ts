import { Context } from '@/http-utils';
import { Method, HandlerConfig } from '@/http-utils/dist/controller';
import { response, HttpResponse } from '@/http-utils/dist/response';
import * as healthService from './service';

async function simpleHealthCheck(): HttpResponse {
    return response();
}

async function extensiveHealthCheck(ctx: Context): HttpResponse {
    ctx.logger.info('Doing extensive health check...');
    const dbHealth = await healthService.checkDb(ctx);
    return response().json({
        db: dbHealth,
    });
}

export function endpoints(): HandlerConfig[] {
    const prefix = '/health';
    return [
        {
            method: Method.Get,
            route: prefix,
            handler: simpleHealthCheck,
        },
        {
            method: Method.Get,
            route: `${prefix}/extensive`,
            handler: extensiveHealthCheck,
        },
    ];
}
