const db = require("../database/database");


// Save User Profile

function saveProfile(userId, name){


    db.run(

    `
    INSERT INTO users
    (
        user_id,
        name
    )

    VALUES(?,?)

    ON CONFLICT(user_id)

    DO UPDATE SET

    name=excluded.name

    `,

    [
        userId,
        name
    ]

    );


}



// Get Profile

function getProfile(userId, callback){


    db.get(

    `
    SELECT *

    FROM users

    WHERE user_id=?

    `,

    [
        userId
    ],

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

    saveProfile,
    getProfile

};
