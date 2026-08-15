const axios = require("axios");


async function askAI(messages) {

    try {

        if (!process.env.OPENROUTER_API_KEY) {

            return "OpenRouter API key পাওয়া যায়নি ❌";

        }


        console.log("🤖 Using OpenRouter Agent");


        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {

                model: "openai/gpt-4o-mini",


                messages: [

                    {
                        role: "system",
                        content:
`তুমি NoorSepiens AI Agent।

নিয়ম:
- স্বাভাবিক বাংলায় উত্তর দাও।
- বর্তমান তথ্য, খবর, দাম, আবহাওয়া, নতুন ঘটনা জানতে হলে web search ব্যবহার করো।
- তথ্য না জানলে অনুমান করবে না।
- সংক্ষিপ্ত ও পরিষ্কার উত্তর দাও।`
                    },

                    ...messages

                ],


                tools: [

                    {
                        type: "function",

                        function: {

                            name: "web_search",

                            description:
                            "Search internet for latest information",

                            parameters: {

                                type: "object",

                                properties: {

                                    query: {
                                        type: "string"
                                    }

                                },

                                required: [
                                    "query"
                                ]

                            }

                        }

                    }

                ],


                temperature: 0.7

            },


            {

                headers: {

                    Authorization:
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                    "application/json",

                    "HTTP-Referer":
                    "https://railway.app",

                    "X-Title":
                    "NoorSepiens AI"

                }

            }

        );



        const aiMessage =
        response.data.choices[0].message;



        // Normal AI reply

        if (
            aiMessage.content &&
            aiMessage.content.trim()
        ) {

            return aiMessage.content;

        }



        // Tool request

        if (aiMessage.tool_calls) {


            console.log(
                "Tool requested:",
                aiMessage.tool_calls
            );


            return "আমি তথ্য খুঁজে দেখছি... 🔎";


        }



        return "দুঃখিত, কোনো উত্তর পাওয়া যায়নি ❌";



    } catch(error) {


        console.log(
            "AI ERROR:",
            error.response?.data || error.message
        );


        return "AI উত্তর দিতে সমস্যা হচ্ছে ❌";


    }

}



module.exports = askAI;
