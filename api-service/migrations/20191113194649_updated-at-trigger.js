exports.up = knex => {
    return knex.raw(`
        CREATE OR REPLACE FUNCTION set_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
};

exports.down = knex => {
    return knex.raw(`
        DROP FUNCTION set_updated_at_column;
    `);
};
