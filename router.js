const axios = require("axios");
const webSearch = require("./webSearch");



async function callOpenRouter(messages, useTools = false){


    const body = {

        model: "openai/gpt-4o-mini",

        messages: messages,

        temperature: 0.7

    };



    if(useTools){

        body.tools = [

            {
                type:"function",

                function:{

                    name:"web_search",

                    description:
                    "Search web for latest information, news and realtime data",

                    parameters:{

                        type:"object",

                        properties:{

                            query:{
                                type:"string",
                                description:
                                "Search query"
                            }

                        },

                        required:[
                            "query"
                        ]

                    }

                }

            }

        ];


        body.tool_choice="auto";

    }




    const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        body,


        {

            headers:{

                Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type":
                "application/json"

            }

        }

    );



    return response.data.choices[0].message;


}







async function router(messages){


try{


console.log(
"Using OpenRouter Agent"
);



// First AI call

const aiMessage =
await callOpenRouter(
    messages,
    true
);





// Tool request check

if(aiMessage.tool_calls){



    const tool =
    aiMessage.tool_calls[0];



    if(
    tool.function.name === "web_search"
    ){



        const args =
        JSON.parse(
            tool.function.arguments
        );



        console.log(
        "Searching web:",
        args.query
        );



        const searchData =
        await webSearch(
            args.query
        );



        console.log(
        "Search results received"
        );

        console.log(searchData);






        const finalMessages=[



        {

            role:"system",

            content:
`
তুমি NoorSepiens AI।

ওয়েব সার্চ থেকে পাওয়া তথ্য ব্যবহার করে
ব্যবহারকারীকে উত্তর দাও।

বাংলায় উত্তর দেবে।
প্রয়োজনে source উল্লেখ করবে।
নিজে থেকে তথ্য বানাবে না।
`
        },



        ...messages,



        {

            role:"assistant",

            content:null,

            tool_calls:
            aiMessage.tool_calls

        },



        {

            role:"tool",

            tool_call_id:
            tool.id,

            content:
            searchData

        }



        ];





        console.log(
        "Sending search result back to AI..."
        );



        const finalAI =
        await callOpenRouter(
            finalMessages,
            false
        );



        console.log(
        "Final AI:",
        finalAI
        );



        return finalAI.content;



    }


}





return aiMessage.content;



}

catch(error){


console.log(
"Router Error:",
error.response?.data || error.message
);



return "দুঃখিত, উত্তর দিতে সমস্যা হচ্ছে ❌";


}



}




module.exports = router;
