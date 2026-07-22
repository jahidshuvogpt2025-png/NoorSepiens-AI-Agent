const db = require("./database");

function createLongMemoryTable(){

    db.run(`
        CREATE TABLE IF NOT EXISTS long_memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            key TEXT,
            value TEXT,
            created DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

}


function saveLongMemory(userId, key, value){

    db.run(
        "INSERT INTO long_memory (user_id,key,value) VALUES (?,?,?)",
        [userId,key,value]
    );

}


function getLongMemory(userId, callback){

    db.all(
        "SELECT key,value FROM long_memory WHERE user_id=?",
        [userId],
        (err,rows)=>{

            if(err){
                callback([]);
                return;
            }

            callback(rows);
        }
    );

}


module.exports = {
    createLongMemoryTable,
    saveLongMemory,
    getLongMemory
};
