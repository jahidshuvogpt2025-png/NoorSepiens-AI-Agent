const db = require("../database/database");


// Save long memory

function add(userId, category, text){


    db.run(

    `
    INSERT INTO long_memory
    (
        user_id,
        category,
        memory
    )

    VALUES(?,?,?)

    `,

    [
        userId,
        category,
        text
    ]

    );


}



// Get long memory

function get(userId, callback){


    db.all(

    `
    SELECT category,memory

    FROM long_memory

    WHERE user_id=?

    ORDER BY id DESC

    LIMIT 50

    `,

    [
        userId
    ],

    (err,rows)=>{


        if(err){

            callback([]);

            return;

        }


        callback(rows || []);


    }

    );


}




// Clear long memory

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
