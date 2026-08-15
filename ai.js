const axios = require("axios");
const webSearch = require("./webSearch");


// ===============================
// Gemini REST API
// ===============================

async function askGemini(messages) {

    try {

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API key missing");
        }


        console.log("🤖 Using Gemini REST");


        const prompt = messages
            .map(m => `${m.role}: ${m.content}`)
            .join("\n");


        const response = await axios.post(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            },

            {
                headers:{
                    "Content-Type":"application/json"
                }
            }

        );


        return response.data
            .candidates[0]
            .content
            .parts[0]
            .text;


    } catch(error){

        console.log(
            "Gemini Error:",
            error.response?.data || error.message
        );

        throw error;

    }

}



// ===============================
// OpenRouter API
// ===============================

async function askOpenRouter(messages){

    try{


        if(!process.env.OPENROUTER_API_KEY){

            throw new Error(
                "OpenRouter API key missing"
            );

        }


        console.log("🤖 Using OpenRouter");


        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {

                model:
                "openai/gpt-4o-mini",

                messages,

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


        return response.data
        .choices[0]
        .message
        .content;


    }catch(error){

        console.log(
            "OpenRouter Error:",
            error.response?.data || error.message
        );


        throw error;

    }

}



// ===============================
// Main AI Function
// ===============================

async function askAI(messages){

    try{


        const userMessage =
        messages[messages.length-1].content;



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



            if(results.length > 0){

                finalMessages.unshift({

                    role:"system",

                    content:

`Web search তথ্য:

${JSON.stringify(results,null,2)}

এই তথ্য ব্যবহার করে বাংলায় স্বাভাবিক উত্তর দাও।`

                });

            }

        }




        // First try OpenRouter

        try{

            return await askOpenRouter(
                finalMessages
            );

        }

        catch(e){

            console.log(
                "OpenRouter failed, switching Gemini..."
            );

        }




        // Backup Gemini

        return await askGemini(
            finalMessages
        );




    }

    catch(error){


        console.log(
            "AI ERROR:",
            error.response?.data ||
            error.message
        );


        return "AI উত্তর দিতে সমস্যা হচ্ছে ❌";


    }

}



module.exports = askAI;
