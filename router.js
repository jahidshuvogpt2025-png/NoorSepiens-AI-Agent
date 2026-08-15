const axios = require("axios");


async function router(messages, tools = []) {

    try {

        const today = new Date()
            .toISOString()
            .split("T")[0];


        const systemMessage = {

            role: "system",

            content: `
তুমি NoorSepiens AI.

Current date: ${today}

তুমি একজন intelligent AI assistant.

Rules:

- সবসময় বাংলায় উত্তর দাও।
- Realtime তথ্যের ক্ষেত্রে অনুমান করবে না।
- User যদি আজকের খবর, সর্বশেষ খবর, latest update, current event বা realtime তথ্য চায় তাহলে web search ব্যবহার করো।
- সর্বশেষ এবং নির্ভরযোগ্য source ব্যবহার করো।
- পুরোনো তথ্য ব্যবহার করো না, যদি user historical তথ্য না চায়।
- প্রয়োজন হলে source উল্লেখ করো।
- উত্তর পরিষ্কার, সংক্ষিপ্ত এবং helpful রাখো।

`
        };


        const finalMessages = [
            systemMessage,
            ...messages
        ];



        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {

                model:"openai/gpt-4o-mini",

                messages: finalMessages,

                tools: tools,

                temperature:0.7

            },

            {

                headers:{

                    "Authorization":
                    `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type":
                    "application/json"

                }

            }

        );



        const aiMessage =
        response.data.choices[0].message;



        if(aiMessage.content){

            return aiMessage.content;

        }



        if(aiMessage.tool_calls){

            console.log(
                "Tool requested:",
                aiMessage.tool_calls
            );


            return {

                tool_calls:
                aiMessage.tool_calls

            };

        }



        return "দুঃখিত, কোনো উত্তর পাওয়া যায়নি ❌";


    }


    catch(error){

        console.log(
            "Router Error:",
            error.response?.data || error.message
        );


        return "AI উত্তর দিতে সমস্যা হচ্ছে ❌";

    }

}



module.exports = router;
