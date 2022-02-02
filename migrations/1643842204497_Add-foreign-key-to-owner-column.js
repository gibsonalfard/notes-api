/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Create new user
    pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')");

    // Assign created user as owner for unowned notes
    pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner = NULL");

    // Add foreign key to table
    pgm.addConstraint('notes', 'fk_notes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE')
};

exports.down = pgm => {
    // Delete foreign key from table
    pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

    // Set owner field to NULL
    pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");

    // Delete user
    pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
