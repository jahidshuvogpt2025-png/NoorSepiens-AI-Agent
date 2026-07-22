require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const askAI = require("./ai");
const memory = require("./memory");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});


console.log("NoorSepiens AI Bot Started ✅");


bot.onText(/\/start/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
        `🤖 Welcome to NoorSepiens AI

আমি তোমার Personal AI Assistant.

প্রশ্ন করো, আমি উত্তর দেবো।`
    );

});


bot.onText(/\/memory/, (msg) => {

    const chatId = msg.chat.id;

    memory.getMemory(chatId, (data)=>{

        if(data.length === 0){
            bot.sendMessage(chatId,"Memory empty 🧠");
            return;
        }

        let text = "🧠 Your Memory:\n\n";

        data.forEach(item=>{
            text += `${item.role}: ${item.message}\n\n`;
        });

        bot.sendMessage(chatId,text);

    });

});


bot.onText(/\/clear/, (msg)=>{

    const chatId = msg.chat.id;

    memory.clearMemory(chatId);

    bot.sendMessage(chatId,"Memory cleared ✅");

});


bot.on("message", async (msg)=>{

    if(!msg.text) return;

    if(msg.text.startsWith("/")) return;


    const chatId = msg.chat.id;
    const userText = msg.text;


    memory.saveMemory(
        chatId,
        "user",
        userText
    );


    memory.getMemory(chatId, async(history)=>{


        const messages = [
            {
                role:"system",
                content:
                "You are NoorSepiens AI. Reply naturally and intelligently."
            },
            ...history.map(h=>({
                role:h.role,
                content:h.message
            }))
        ];


        const reply = await askAI(messages);


        memory.saveMemory(
            chatId,
            "assistant",
            reply
        );


        bot.sendMessage(
            chatId,
            reply
        );


    });

});
