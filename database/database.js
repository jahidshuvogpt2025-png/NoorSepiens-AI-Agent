const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database(
    "./noorsepiens.db"
);



db.serialize(()=>{


    db.run(`
    CREATE TABLE IF NOT EXISTS users(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id TEXT UNIQUE,

        username TEXT,

        name TEXT,

        join_date DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `);



    db.run(`
    CREATE TABLE IF NOT EXISTS memory(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id TEXT,

        role TEXT,

        content TEXT,

        time DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `);



    db.run(`
    CREATE TABLE IF NOT EXISTS long_memory(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id TEXT,

        memory TEXT,

        time DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `);


});


module.exports = db;
