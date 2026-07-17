const db = require("../database/database");


// Check Admin

function isAdmin(userId){

    return String(userId) === String(process.env.ADMIN_ID);

}



// Get Total Users

function getUserCount(callback){


    db.get(

    `
    SELECT COUNT(*) AS total

    FROM users

    `,

    [],

    (err,row)=>{


        if(err){

            callback(0);
            return;

        }


        callback(row.total);


    }

    );


}



module.exports = {

    isAdmin,
    getUserCount

};
