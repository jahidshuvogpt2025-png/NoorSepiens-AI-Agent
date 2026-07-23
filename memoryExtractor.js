const longMemory = require("./longmemory");


// Convert Bangla number to English number
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




function extractMemory(chatId, text){


    const patterns = [


        // Name
        {
            regex: /(?:আমার নাম|আমাকে)\s*(?:হলো|হয়|হয়|:)?\s*([^\s?!.,]+)/,
            key:"name"
        },


        // Age
        {
            regex: /আমার বয়স\s*([০-৯0-9]+)/,
            key:"age"
        },


        // Location
        {
            regex: /আমি\s*(.+?)\s*থাকি/,
            key:"location"
        }


    ];




    patterns.forEach(item=>{


        const match = text.match(item.regex);



        if(match){


            let value = match[1].trim();



            // Convert age number
            if(item.key === "age"){

                value = convertBanglaNumber(value);

            }



            longMemory.saveLongMemory(
                chatId,
                item.key,
                value
            );


        }


    });


}





module.exports = {

    extractMemory

};