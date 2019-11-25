import { Context } from '@/http-utils';
import * as healthRepo from './repo';

export async function checkDb(ctx: Context): Promise<boolean> {
    const healthy = await healthRepo.canConnect(ctx);
    return healthy;
}
