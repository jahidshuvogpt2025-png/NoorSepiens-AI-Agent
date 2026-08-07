const axios = require("axios");
const cheerio = require("cheerio");

async function webSearch(query) {
    try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(response.data);

        let results = [];

        $(".result").each((i, el) => {
            if (i < 5) {
                results.push({
                    title: $(el).find(".result__title").text(),
                    link: $(el).find(".result__a").attr("href"),
                    snippet: $(el).find(".result__snippet").text()
                });
            }
        });

        return JSON.stringify(results, null, 2);

    } catch (error) {
        console.log("Web search error:", error.message);
        return [];
    }
}

module.exports = webSearch;
