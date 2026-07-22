const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./noorsepiens.db");


// Memory table

db.serialize(()=>{

    db.run(`
        CREATE TABLE IF NOT EXISTS memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            role TEXT,
            message TEXT,
            time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


    // Long Memory table

    db.run(`
        CREATE TABLE IF NOT EXISTS long_memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            key TEXT,
            value TEXT,
            created DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);



    // Users table

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_id TEXT UNIQUE,
            username TEXT,
            first_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


});


module.exports = db;
