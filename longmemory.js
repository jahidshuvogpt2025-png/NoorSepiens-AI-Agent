const { db } = require("./database");


// Create Long Memory Table

function createLongMemoryTable(){
    // lowdb এ table create লাগে না
}




// Save Long Memory

async function saveLongMemory(userId, key, value){

    await db.read();

    userId = String(userId);

    value = String(value).trim();


    const existing = db.data.long_memory.find(
        m => m.user_id === userId && m.key === key
    );


    if(existing){

        existing.value = value;
        existing.created = new Date().toISOString();

    }else{

        db.data.long_memory.push({

            id: Date.now(),

            user_id: userId,

            key: key,

            value: value,

            created: new Date().toISOString()

        });

    }


    await db.write();

}





// Get Long Memory

async function getLongMemory(userId, callback){

    await db.read();


    const data = db.data.long_memory.filter(
        m => m.user_id === String(userId)
    );


    callback(data);

}





// Clear Long Memory

async function clearLongMemory(userId){

    await db.read();


    db.data.long_memory =
    db.data.long_memory.filter(
        m => m.user_id !== String(userId)
    );


    await db.write();

}




module.exports = {

    createLongMemoryTable,

    saveLongMemory,

    getLongMemory,

    clearLongMemory

};