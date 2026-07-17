const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database(
    "./noorsepiens.db"
);



db.serialize(()=>{


    // Users Table

    db.run(`

CREATE TABLE IF NOT EXISTS users (

id INTEGER PRIMARY KEY AUTOINCREMENT,

telegram_id TEXT UNIQUE,

username TEXT,

first_name TEXT,

status TEXT DEFAULT 'active',

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);

    db.run(`
    CREATE TABLE IF NOT EXISTS users(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id TEXT UNIQUE,

        username TEXT,

        name TEXT,

        join_date DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `);



    // Short Memory

    db.run(`
    CREATE TABLE IF NOT EXISTS memory(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id TEXT,

        role TEXT,

        content TEXT,

        time DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `);



    // Long + Personality Memory

    db.run(`
    CREATE TABLE IF NOT EXISTS long_memory(

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id TEXT,

        category TEXT,

        memory TEXT,

        importance INTEGER DEFAULT 1,

        time DATETIME DEFAULT CURRENT_TIMESTAMP

    )
    `);



});



console.log("Database Personality Upgrade Ready ✅");



module.exports = db;
