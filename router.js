const axios = require("axios");
const webSearch = require("./webSearch");


async function askOpenRouter(messages) {

    const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {
            model: "openai/gpt-4o-mini",

            messages: messages,

            temperature: 0.7
        },

        {
            headers: {

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


    console.log("Using OpenRouter Agent");


    // First AI call

    const aiMessage =
    await askOpenRouter(messages);



    // Check web tool request

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



            const searchData =
            await webSearch(
                args.query
            );



            const finalMessages=[


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

                },


                {

                    role:"system",

                    content:
`
এই ওয়েব সার্চ রেজাল্ট ব্যবহার করে
ব্যবহারকারীকে বাংলায় সুন্দর ও নির্ভুল উত্তর দাও।

প্রয়োজনে source উল্লেখ করো।
ভুল তথ্য অনুমান করবে না।
`

                }

            ];




            const finalAI =
            await askOpenRouter(
                finalMessages
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


    return "দুঃখিত, উত্তর তৈরি করতে সমস্যা হয়েছে ❌";


}



}



module.exports = router;
