const { db } = require("./database");


// Create Users Table
function createUsersTable(){
    // lowdb এ table create লাগে না
    console.log("Users system ready ✅");
}



// Register User

async function registerUser(user){

    await db.read();


    const exists = db.data.users.find(
        u => u.telegram_id === String(user.id)
    );


    if(!exists){

        db.data.users.push({

            telegram_id: String(user.id),

            username: user.username || "",

            first_name: user.first_name || "",

            created_at: new Date().toISOString()

        });


        await db.write();

    }

}





// Get User

async function getUser(id, callback){

    await db.read();


    const user = db.data.users.find(
        u => u.telegram_id === String(id)
    );


    callback(user);

}





module.exports = {

    createUsersTable,

    registerUser,

    getUser

};