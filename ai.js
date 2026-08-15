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

তোমার কাজ:
- ব্যবহারকারীর প্রশ্ন বুঝে উত্তর দেওয়া।
- যদি তথ্য বর্তমান সময়ের উপর নির্ভর করে (খবর, দাম, আবহাওয়া, রাজনীতি, নতুন তথ্য, ওয়েবসাইট তথ্য) তাহলে web search ব্যবহার করবে।
- প্রয়োজন হলে ওয়েব পেজ পড়ে তথ্য সংগ্রহ করবে।
- পাওয়া তথ্য বাংলায় সুন্দরভাবে summarize করবে।
- অপ্রয়োজনীয় link না দিয়ে মূল তথ্য দেবে।`
                    },

                    ...messages

                ],



                tools: [

                    {
                        type: "function",
                        function: {

                            name: "web_search",

                            description:
                            "Search the internet for latest information",

                            parameters: {

                                type:"object",

                                properties: {

                                    query:{
                                        type:"string"
                                    }

                                },

                                required:["query"]

                            }

                        }
                    },


                    {
                        type:"function",
                        function:{

                            name:"web_fetch",

                            description:
                            "Read webpage content from URL",

                            parameters:{

                                type:"object",

                                properties:{

                                    url:{
                                        type:"string"
                                    }

                                },

                                required:["url"]

                            }

                        }
                    }

                ],


                temperature:0.7

            },


            {

                headers:{

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



        return response.data
        .choices[0]
        .message
        .content;



    } catch(error){


        console.log(
            "AI ERROR:",
            error.response?.data || error.message
        );


        return "AI উত্তর দিতে সমস্যা হচ্ছে ❌";

    }

}


module.exports = askAI;
