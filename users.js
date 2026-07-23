const { db } = require("./database");


// Create Users System

function createUsersTable(){

    console.log("Users system ready ✅");

}




// Register User

async function registerUser(user){

    await db.read();


    db.data ||= {};

    db.data.users ||= [];



    const exists = db.data.users.find(
        u => String(u.telegram_id) === String(user.id)
    );



    if(!exists){


        db.data.users.push({

            telegram_id: String(user.id),

            username: user.username || "",

            first_name: user.first_name || "",

            created_at: new Date().toISOString()

        });



        await db.write();


        console.log(
            "New user saved:",
            user.id
        );


    }

}





// Get User

async function getUser(id, callback){

    await db.read();


    db.data ||= {};

    db.data.users ||= [];



    const user = db.data.users.find(

        u => String(u.telegram_id) === String(id)

    );



    if(callback){

        callback(user);

    }


}




// Export

module.exports = {

    createUsersTable,

    registerUser,

    getUser

};