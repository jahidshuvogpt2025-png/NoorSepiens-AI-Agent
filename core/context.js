const db = require("../database/database");

const longMemory = require("./longmemory");



function getContext(userId, callback){


    // Get User Profile

    db.get(

    `
    SELECT *

    FROM users

    WHERE user_id=?

    `,

    [
        userId
    ],


    (err,user)=>{



        // Get Short Memory

        db.all(

        `
        SELECT role,content

        FROM memory

        WHERE user_id=?

        ORDER BY id DESC

        LIMIT 10

        `,

        [
            userId
        ],


        (err,memory)=>{



            // Get Long Memory

            longMemory.get(

            userId,

            (longMemoryData)=>{


                callback({


                    user:user || {},


                    memory:
                    (memory || []).reverse(),


                    longMemory:
                    longMemoryData || []


                });



            });



        });



    });



}



module.exports={

getContext

};
