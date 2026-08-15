const axios = require("axios");
const webSearch = require("./webSearch");


async function router(messages) {

    try {


        const firstResponse = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",

                messages: messages,

                temperature: 0.7,


                tools: [
                    {
                        type: "function",

                        function: {

                            name: "web_search",

                            description:
                            "Search the web for latest information when needed",

                            parameters: {

                                type: "object",

                                properties: {

                                    query: {
                                        type:"string",
                                        description:
                                        "Search query"
                                    }

                                },

                                required:["query"]

                            }

                        }
                    }
                ],


                tool_choice:"auto"

            },


            {

                headers:{

                    Authorization:
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                    "application/json"

                }

            }

        );



        const aiMessage =
        firstResponse.data.choices[0].message;



        // AI requested web search

        if(aiMessage.tool_calls){


            const tool =
            aiMessage.tool_calls[0];


            if(tool.function.name==="web_search"){


                const args =
                JSON.parse(
                    tool.function.arguments
                );


                console.log(
                    "Searching web:",
                    args.query
                );



                const searchResult =
                await webSearch(
                    args.query
                );



                const secondMessages = [


                    ...messages,


                    aiMessage,


                    {

                        role:"tool",

                        tool_call_id:
                        tool.id,


                        content:
                        searchResult

                    }


                ];




                const finalResponse =
                await axios.post(

                    "https://openrouter.ai/api/v1/chat/completions",


                    {

                        model:
                        "openai/gpt-4o-mini",


                        messages:
                        secondMessages,


                        temperature:0.7

                    },


                    {

                        headers:{

                            Authorization:
                            `Bearer ${process.env.OPENROUTER_API_KEY}`,

                            "Content-Type":
                            "application/json"

                        }

                    }

                );



                return finalResponse
                .data
                .choices[0]
                .message
                .content;



            }

        }





        return aiMessage.content;



    }

    catch(error){


        console.log(
            "Router Error:",
            error.response?.data || error.message
        );


        return "দুঃখিত, AI উত্তর দিতে সমস্যা হচ্ছে ❌";


    }


}



module.exports = router;
