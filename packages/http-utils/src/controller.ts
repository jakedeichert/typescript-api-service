import joi from '@hapi/joi';
import { Context } from './index';
import { HttpResponse } from './response';

export enum Method {
    Get = 'get',
    Post = 'post',
    Put = 'put',
    Patch = 'patch',
    Del = 'del',
}

export interface Controller {
    endpoints(): HandlerConfig[];
}

export interface HandlerConfig {
    method: Method;
    route: string;
    handler: (ctx: Context) => HttpResponse;
    querySchema?: KeyValueMap<joi.Schema>;
    bodySchema?: KeyValueMap<joi.Schema>;
}

// Return a reference to joi so the client doesn't have to install it.
export function validator(): joi.Root {
    return joi;
}
