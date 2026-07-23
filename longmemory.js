const db = require("./database");


// Create Long Memory Table

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



// Save Smart Long Memory

function saveLongMemory(userId, key, value){

    userId = String(userId);
    value = String(value).trim();


    if(!value || value.length < 2){
        return;
    }


    db.get(
        `
        SELECT id,value 
        FROM long_memory
        WHERE user_id=? AND key=?
        `,
        [
            userId,
            key
        ],
        (err,row)=>{


            if(row){


                // Avoid duplicate update

                if(row.value !== value){

                    db.run(
                        `
                        UPDATE long_memory
                        SET value=?, created=CURRENT_TIMESTAMP
                        WHERE id=?
                        `,
                        [
                            value,
                            row.id
                        ]
                    );

                }


            }else{


                db.run(
                    `
                    INSERT INTO long_memory
                    (user_id,key,value)
                    VALUES (?,?,?)
                    `,
                    [
                        userId,
                        key,
                        value
                    ]
                );


            }


            // Keep maximum 50 memories

            db.run(
                `
                DELETE FROM long_memory
                WHERE user_id=?
                AND id NOT IN (
                    SELECT id 
                    FROM long_memory
                    WHERE user_id=?
                    ORDER BY id DESC
                    LIMIT 50
                )
                `,
                [
                    userId,
                    userId
                ]
            );


        }
    );

}




// Get Long Memory

function getLongMemory(userId, callback){

    userId = String(userId);


    db.all(
        `
        SELECT key,value
        FROM long_memory
        WHERE user_id=?
        ORDER BY id DESC
        `,
        [
            userId
        ],
        (err,rows)=>{


            if(err){
                callback([]);
                return;
            }


            callback(rows);

        }
    );

}




// Clear Long Memory

function clearLongMemory(userId){

    userId = String(userId);


    db.run(
        `
        DELETE FROM long_memory
        WHERE user_id=?
        `,
        [
            userId
        ]
    );

}



module.exports = {

    createLongMemoryTable,
    saveLongMemory,
    getLongMemory,
    clearLongMemory

};