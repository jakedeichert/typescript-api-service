import { createServer, HttpServer } from '@/http-utils/dist/server';
import * as healthController from './health/controller';
import logger from '@/http-utils/dist/middleware/logger';
import errorHandler from '@/http-utils/dist/middleware/error-handler';
import bodyParser from '@/http-utils/dist/middleware/body-parser';
import responseBuilder from '@/http-utils/dist/middleware/response-builder';
import dbTxnProvider from '@/http-utils/dist/middleware/db-txn-provider';
import { IS_TEST_MODE } from './config';
import { Controller } from '@/http-utils/dist/controller';
import { MiddlewareHandler } from '@/http-utils/dist/middleware';

export function getControllers(): Controller[] {
    return [healthController];
}

export function getMiddleware(): Array<MiddlewareHandler | null> {
    return [
        logger,
        errorHandler(!IS_TEST_MODE),
        bodyParser(1),
        responseBuilder,
        IS_TEST_MODE ? null : dbTxnProvider,
    ];
}

export function buildServer(): HttpServer {
    return createServer(getControllers(), getMiddleware());
}
