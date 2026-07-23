const longMemory = require("./longmemory");


// Bangla number convert

function convertBanglaNumber(str){

    const bangla = "০১২৩৪৫৬৭৮৯";
    const english = "0123456789";

    return str
    .split("")
    .map(ch=>{

        const index = bangla.indexOf(ch);

        return index > -1
        ? english[index]
        : ch;

    })
    .join("");

}





async function extractMemory(chatId, text){


    const patterns = [


        // Name
        {
            regex:/আমার নাম\s*(?:হলো|হয়|হয়|:)?\s*([^\s?!.,]+)/,
            key:"name"
        },


        // Age
        {
            regex:/আমার বয়স\s*(?:হলো|হয়|:)?\s*([০-৯0-9]+)/,
            key:"age"
        },


        // Location
        {
            regex:/আমি\s+(.+?)\s+থাকি/,
            key:"location"
        },


        // Study
        {
            regex:/আমি\s+(.+?)\s*(?:পড়ি|পড়ি|পড়াশোনা করি|পড়াশোনা করি)/,
            key:"study"
        },


        // Work / Profession
        {
            regex:/আমি\s+(.+?)\s*(?:কাজ করি|কাজ করি)/,
            key:"work"
        },


        // Interest
        {
            regex:/(?:আমি|আমার)\s+(.+?)\s*(?:ভালো লাগে|পছন্দ করি|পছন্দ)/,
            key:"interest"
        },


        // Goal
        {
            regex:/(?:আমার লক্ষ্য|আমি হতে চাই|আমি হতে চাই:)\s*(.+)/,
            key:"goal"
        }


    ];





    for(const item of patterns){


        const match = text.match(item.regex);



        if(match){


            let value = match[1].trim();



            if(item.key==="age"){

                value = convertBanglaNumber(value);

            }



            await longMemory.saveLongMemory(
                chatId,
                item.key,
                value
            );


            console.log(
                "Memory saved:",
                item.key,
                value
            );


        }


    }


}





module.exports = {

    extractMemory

};