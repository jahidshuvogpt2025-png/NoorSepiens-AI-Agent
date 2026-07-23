const { saveLongMemory } = require("./longmemory");



async function extractMemory(chatId, text){


    const patterns = [


        {
            regex:/আমার নাম\s*(?:হলো|হয়|হয়|:)?\s*([^\s.,!?]+)/,
            key:"name"
        },


        {
            regex:/আমার বয়স\s*(\d+)/,
            key:"age"
        },


        {
            regex:/আমি\s*(.+?)\s*থাকি/,
            key:"location"
        },


        {
            regex:/আমি\s*(.+?)\s*পড়ি/,
            key:"education"
        },


        {
            regex:/আমার পছন্দ\s*(.+)/,
            key:"favorite"
        },


        {
            regex:/আমি\s*(.+?)\s*কাজ করি/,
            key:"profession"
        }


    ];



    for(const item of patterns){


        const match = text.match(item.regex);


        if(match){


            const value = match[1].trim();


            await saveLongMemory(
                chatId,
                item.key,
                value
            );


        }


    }



}



module.exports = {
    extractMemory
};