const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");


// Database file

const adapter = new JSONFile("noorsepiens.json");


// Default data

const defaultData = {
    users: [],
    memory: [],
    long_memory: []
};


// Create database

const db = new Low(adapter, defaultData);



// Initialize database

async function initDB(){

    await db.read();


    if(!db.data){

        db.data = defaultData;

    }


    db.data.users ||= [];
    db.data.memory ||= [];
    db.data.long_memory ||= [];


    await db.write();


    console.log("Database Ready ✅");

}



module.exports = {
    db,
    initDB
};