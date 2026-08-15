const axios = require("axios");
const cheerio = require("cheerio");


async function readURL(url){

    try{

        console.log("Reading URL:", url);


        const response = await axios.get(url,{

            headers:{
                "User-Agent":
                "Mozilla/5.0"
            },

            timeout:10000

        });



        const $ = cheerio.load(response.data);



        $("script").remove();
        $("style").remove();



        let text =
        $("body")
        .text()
        .replace(/\s+/g," ")
        .trim();



        return text.slice(0,6000);



    }catch(error){

        console.log(
            "URL READ ERROR:",
            error.message
        );


        return "Unable to read webpage";

    }

}



module.exports = readURL;
