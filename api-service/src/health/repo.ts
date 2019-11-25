import { Context } from '@/http-utils';
import { query } from '@/db-utils';

// Test the database connection with a basic query.
export async function canConnect(ctx: Context): Promise<boolean> {
    const sql = `SELECT :num;`;
    const results = await query(ctx, sql, { num: 1 });
    if (!results.rows.length) return false;
    return true;
}
