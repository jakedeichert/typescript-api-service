exports.up = knex => {
    // Throws an exception if the value is null, otherwise return it.
    // USAGE:
    // SELECT expect_non_null_value('abc'::text, 'INVALID');
    // SELECT expect_non_null_value(123, 'INVALID');

    return knex.raw(`
        CREATE OR REPLACE FUNCTION expect_non_null_value(val ANYELEMENT, msg TEXT)
        RETURNS ANYELEMENT AS
        $func$
        BEGIN
            IF val IS NULL THEN
                RAISE EXCEPTION '%', msg;
            END IF;

            RETURN val;
        END
        $func$ LANGUAGE plpgsql IMMUTABLE;
    `);
};

exports.down = knex => {
    return knex.raw(`
        DROP FUNCTION IF EXISTS expect_non_null_value;
    `);
};
