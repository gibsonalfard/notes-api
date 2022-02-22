/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('collaborations', {
        id: { type: 'VARCHAR(50)', primaryKey: true },
        note_id: { type: 'VARCHAR(50)', notNull: true },
        user_id: { type: 'VARCHAR(50)', notNull: true }
    });

    pgm.addConstraint('collaborations', 'unique_note_and_user_id', 'UNIQUE(note_id, user_id)');

    pgm.addConstraint('collaborations', 'fk_collaborations_notes', 'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE');
    pgm.addConstraint('collaborations', 'fk_collaborations_users', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('collaborations');
};
