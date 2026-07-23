const db = require("./database");


// Save Short Memory

async function saveMemory(userId, role, message){

    await db.read();

    db.data.memory.push({

        id: Date.now(),

        user_id: String(userId),

        role: role,

        message: message,

        time: new Date().toISOString()

    });


    // Keep last 20 messages

    db.data.memory =
    db.data.memory.filter(item =>
        item.user_id === String(userId)
    ).slice(-20);


    await db.write();

}





// Get Short Memory

async function getMemory(userId, callback){

    await db.read();


    const rows =
    db.data.memory
    .filter(item =>
        item.user_id === String(userId)
    )
    .slice(-20)
    .map(item=>({

        role:item.role,

        message:item.message

    }));


    callback(rows);

}





// Clear Short Memory

async function clearMemory(userId){

    await db.read();


    db.data.memory =
    db.data.memory.filter(item =>
        item.user_id !== String(userId)
    );


    await db.write();

}



module.exports = {

    saveMemory,
    getMemory,
    clearMemory

};