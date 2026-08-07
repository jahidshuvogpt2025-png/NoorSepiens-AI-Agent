const axios = require("axios");
const webSearch = require("./webSearch");

async function askAI(messages) {

    try {

        if (!process.env.OPENROUTER_API_KEY) {
            return "OpenRouter API key পাওয়া যায়নি ❌";
        }

        const userMessage = messages[messages.length - 1].content;

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

        let finalMessages = [...messages];


        const needSearch = searchWords.some(word =>
            userMessage.toLowerCase().includes(word.toLowerCase())
        );


        if (needSearch) {

            console.log("🔎 Web search:", userMessage);

            const results = await webSearch(userMessage);

            if (results.length > 0) {

                finalMessages.unshift({
                    role: "system",
                    content:
`নিচের web search তথ্য ব্যবহার করে উত্তর তৈরি করো:

${JSON.stringify(results, null, 2)}

বাংলায় স্বাভাবিকভাবে উত্তর দাও।`
                });

            }
        }


        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openai/gpt-4o-mini",
                messages: finalMessages,
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
