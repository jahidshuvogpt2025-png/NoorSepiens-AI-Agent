const longMemory = require("./longmemory");


function extractMemory(chatId, text){

    const patterns = [

        {
            regex: /আমার নাম\s*(\S+)/,
            key:"name"
        },

        {
            regex: /আমি\s*(\S+)\s*থাকি/,
            key:"location"
        },

        {
            regex: /আমার বয়স\s*(\d+)/,
            key:"age"
        }

    ];


    patterns.forEach(item=>{

        const match = text.match(item.regex);


        if(match){

            longMemory.saveLongMemory(
                chatId,
                item.key,
                match[1]
            );

        }

    });

}


module.exports = {
    extractMemory
};