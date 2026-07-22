const axios = require("axios");
require("dotenv").config();

async function askAI(messages) {

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: messages
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        console.log(error.response?.data || error.message);
        return "AI সমস্যায় পড়েছে ❌";
    }
}

module.exports = askAI;
