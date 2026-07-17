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



        rows = rows || [];



        // Auto Repair Old Memory

        rows.forEach(item=>{


            const text = item.memory.toLowerCase();



            // Python / Coding = Skill

            if(

                item.category === "instruction" &&

                (
                    text.includes("python") ||
                    text.includes("coding") ||
                    text.includes("programming") ||
                    text.includes("ai") ||
                    text.includes("শিখ")
                )

            ){

                item.category = "skill";

                item.importance = 4;


            }




            // Calling preference = Style

            if(

                text.includes("গুরু বলে ডাকবে") ||
                text.includes("আমাকে গুরু")

            ){

                item.category = "style";

                item.importance = 5;


            }




            // Project

            if(

                text.includes("noorsepiens") ||
                text.includes("project") ||
                text.includes("প্রজেক্ট")

            ){

                item.category = "project";

                item.importance = 5;


            }



        });




        callback(rows);


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




module.exports = {

    add,

    get,

    clear

};
