const axios = require("axios");
const cheerio = require("cheerio");

async function webSearch(query) {
    try {

        const url =
        `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

        const response = await axios.get(url, {
            headers:{
                "User-Agent":"Mozilla/5.0"
            },
            timeout:10000
        });


        const $ = cheerio.load(response.data);

        let results = [];


        $(".result").each((i, el)=>{

            if(i < 5){

                const title =
                $(el)
                .find(".result__a")
                .text()
                .trim();


                const snippet =
                $(el)
                .find(".result__snippet")
                .text()
                .trim();


                if(title || snippet){

                    results.push({
                        title,
                        snippet
                    });

                }

            }

        });


        console.log(
            "Search results:",
            results.length
        );


        return results;


    } catch(error){

        console.log(
            "Web search error:",
            error.message
        );

        return [];

    }
}


module.exports = webSearch;
