const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const webSearch = require("./webSearch");


// ================= GEMINI =================

async function askGemini(messages) {

    try {

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key missing");
        }


        console.log("🤖 Using Gemini");


        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );


        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });


        const prompt = messages
            .map(m => `${m.role}: ${m.content}`)
            .join("\n");


        const result = await model.generateContent(prompt);


        return result.response.text();


    } catch(error){

        console.log(
            "Gemini Error:",
            error.message
        );

        throw error;
    }

}



// ================= OPENROUTER =================


async function askOpenRouter(messages){

    if(!process.env.OPENROUTER_API_KEY){
        throw new Error("OpenRouter API key missing");
    }


    console.log("🤖 Using OpenRouter");


    const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {
            model: "openai/gpt-4o-mini",
            messages: messages,
            temperature: 0.7
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


    return response.data
    .choices[0]
    .message
    .content;

}



// ================= MAIN AI =================


async function askAI(messages){


    try {


        const userMessage =
        messages[messages.length - 1].content;



        // Web search trigger

        const searchWords = [

            "আজ",
            "বর্তমান",
            "খবর",
            "latest",
            "news",
            "price",
            "দাম",
            "weather",
            "আবহাওয়া"

        ];



        let finalMessages = [
            ...messages
        ];



        const needSearch =
        searchWords.some(word =>
            userMessage
            .toLowerCase()
            .includes(word.toLowerCase())
        );



        if(needSearch){


            console.log(
                "🔎 Web search:",
                userMessage
            );


            const results =
            await webSearch(userMessage);



            if(results && results.length){


                finalMessages.unshift({

                    role:"system",

                    content:
`Web search information:

${JSON.stringify(results)}

Use this information and answer naturally in Bangla.`

                });


            }


        }




        // First try OpenRouter

        try{

            return await askOpenRouter(
                finalMessages
            );


        }catch(openRouterError){


            console.log(
                "OpenRouter failed, switching Gemini..."
            );


            return await askGemini(
                finalMessages
            );

        }



    }catch(error){


        console.log(
            "AI ERROR:",
            error.message
        );


        return "AI উত্তর দিতে সমস্যা হচ্ছে ❌";

    }

}



module.exports = askAI;
