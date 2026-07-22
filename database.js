const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./noorsepiens.db");

const longmemory = require("./longmemory");

longmemory.createLongMemoryTable();

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            role TEXT,
            message TEXT,
            time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;
