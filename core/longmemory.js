const db = require("../database/database");


// Add Long Memory

function add(
    userId,
    category,
    text,
    importance = 2
){


    db.run(

    `
    INSERT INTO long_memory
    (
        user_id,
        category,
        memory,
        importance
    )

    VALUES(?,?,?,?)

    `,

    [
        userId,
        category,
        text,
        importance
    ],

    (err)=>{

        if(err){

            console.log(
                "Long Memory Save Error:",
                err.message
            );

        }

    }

    );


}



// Get Long Memory

function get(
    userId,
    callback
){


    db.all(

    `
    SELECT
    category,
    memory,
    importance

    FROM long_memory

    WHERE user_id=?

    ORDER BY importance DESC, id DESC

    LIMIT 50

    `,

    [
        userId
    ],

    (err,rows)=>{


        if(err){

            console.log(err);

            callback([]);

            return;

        }


        callback(rows || []);


    }

    );


}



// Clear Long Memory

function clear(userId){


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



module.exports={

    add,
    get,
    clear

};
