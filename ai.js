const axios = require("axios");
require("dotenv").config();


async function askAI(messages) {

    try {

        if(!process.env.OPENROUTER_API_KEY){

            return "OpenRouter API key পাওয়া যায়নি ❌";

        }


        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openai/gpt-4o-mini",
                messages: messages,
                temperature: 0.7
            },

            {
                headers: {

                    "Authorization":
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                    "application/json"

                }

            }

        );


        return response.data.choices[0].message.content;


    } catch(error){

        console.log(
            "AI ERROR:",
            error.response?.data || error.message
        );


        return "AI বর্তমানে উত্তর দিতে পারছে না ❌";

    }

}


module.exports = askAI;