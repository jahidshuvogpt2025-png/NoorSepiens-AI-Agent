const longMemory = require("./longmemory");


// Bangla number convert

function convertBanglaNumber(str){

    const bangla = "০১২৩৪৫৬৭৮৯";
    const english = "0123456789";

    return str
    .split("")
    .map(ch=>{

        const index = bangla.indexOf(ch);

        return index >= 0 ? english[index] : ch;

    })
    .join("");

}




async function extractMemory(chatId, text){


    const patterns = [


        {
            regex:/আমার নাম\s*(?:হলো|হয়|হয়|:)?\s*([^\s?!.,]+)/,
            key:"name"
        },


        {
            regex:/আমার বয়স\s*(?:হলো|হয়|হয়|:)?\s*([০-৯0-9]+)/,
            key:"age"
        },


        {
            regex:/আমি\s+(.+?)\s+থাকি/,
            key:"location"
        },


        {
            regex:/আমি\s+(.+?)\s*(?:পড়ি|পড়ি|পড়াশোনা করি|পড়াশোনা করি)/,
            key:"study"
        },


        {
            regex:/(?:আমি|আমার)\s+(.+?)\s*(?:শিখছি|শিখতেছি)/,
            key:"skill"
        },


        {
            regex:/আমার লক্ষ্য\s*(?:হলো|হয়|হয়|:)?\s*(.+)/,
            key:"goal"
        },


        {
            regex:/আমার\s+(.+?)\s*(?:ভালো লাগে|পছন্দ করি)/,
            key:"like"
        },


        {
            regex:/আমার\s+(.+?)\s*(?:ভালো লাগে না|পছন্দ করি না)/,
            key:"dislike"
        }


    ];




    for(const item of patterns){


        const match = text.match(item.regex);


        if(match){


            let value = match[1].trim();



            if(item.key === "age"){

                value = convertBanglaNumber(value);

            }



            await longMemory.saveLongMemory(
                chatId,
                item.key,
                value
            );


            console.log(
                "Profile Memory:",
                item.key,
                value
            );

        }

    }

}





module.exports = {

    extractMemory

};