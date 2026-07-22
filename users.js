const db = require("./database");


// Create users table

function createUsersTable(){

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_id TEXT UNIQUE,
            username TEXT,
            first_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

}



// Register new user

function registerUser(user){

    db.run(
        `
        INSERT OR IGNORE INTO users
        (telegram_id, username, first_name)
        VALUES (?, ?, ?)
        `,
        [
            user.id,
            user.username || "",
            user.first_name || ""
        ]
    );

}




// Get user profile

function getUser(userId, callback){

    db.get(
        `
        SELECT * FROM users 
        WHERE telegram_id = ?
        `,
        [userId],
        (err,row)=>{

            if(err){
                callback(null);
                return;
            }

            callback(row);

        }
    );

}



module.exports = {
    createUsersTable,
    registerUser,
    getUser
};
