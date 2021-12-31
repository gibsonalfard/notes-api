exports.up = pgm => {
    pgm.createTable('notes', {
        id: { type: 'char(8)', primaryKey: true },
        name: { type: 'varchar(50)', notNull: true },
        title: { type: 'varchar(255)', notNull: true },
        tags: { type: 'varchar(100)[]', notNull: true },
        createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updatedAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    });
};

exports.down = pgm => {
    pgm.dropTable('notes');
};
