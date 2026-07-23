require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const { initDB } = require("./database");

const memoryExtractor = require("./memoryExtractor");
const users = require("./users");
const askAI = require("./ai");
const memory = require("./memory");
const longMemory = require("./longmemory");
const personality = require("./personality");



async function startBot(){


    await initDB();


    users.createUsersTable();

    longMemory.createLongMemoryTable();



    const bot = new TelegramBot(
        process.env.BOT_TOKEN,
        {
            polling:true
        }
    );


    console.log("NoorSepiens AI Started ✅");




    // START

    bot.onText(/\/start/, async(msg)=>{

        const chatId = msg.chat.id;


        await users.registerUser(msg.from);


        bot.sendMessage(
            chatId,
`🤖 NoorSepiens AI

আপনার Personal AI Assistant চালু হয়েছে ✅

আমি আপনার কথা মনে রাখতে পারবো।
প্রশ্ন করুন।`
        );

    });






    // PROFILE

    bot.onText(/\/profile/, (msg)=>{

        const chatId = msg.chat.id;


        users.getUser(
            chatId,
            (user)=>{


                if(!user){

                    bot.sendMessage(
                        chatId,
                        "Profile পাওয়া যায়নি ❌"
                    );

                    return;

                }


                bot.sendMessage(
                    chatId,
`
👤 User Profile

Name:
${user.first_name}

Username:
@${user.username || "none"}

ID:
${user.telegram_id}
`
                );


            }
        );

    });







    // MEMORY

    bot.onText(/\/memory/, (msg)=>{


        const chatId = msg.chat.id;


        memory.getMemory(
            chatId,
            (data)=>{


                if(data.length===0){

                    bot.sendMessage(
                        chatId,
                        "Memory empty 🧠"
                    );

                    return;

                }


                let text =
                "🧠 Short Memory\n\n";


                data.forEach(item=>{

                    text +=
`${item.role}: ${item.message}\n\n`;

                });



                bot.sendMessage(
                    chatId,
                    text
                );


            }
        );


    });








    // LONG MEMORY


    bot.onText(/\/longmemory/, (msg)=>{


        const chatId = msg.chat.id;


        longMemory.getLongMemory(
            chatId,
            (data)=>{


                if(data.length===0){

                    bot.sendMessage(
                        chatId,
                        "Long Memory empty 🧠"
                    );

                    return;

                }


                let text =
                "🧠 Long Term Memory\n\n";


                data.forEach(item=>{

                    text +=
`${item.key}: ${item.value}\n`;

                });



                bot.sendMessage(
                    chatId,
                    text
                );


            }
        );


    });








    // CLEAR

    bot.onText(/\/clear/, async(msg)=>{


        const chatId = msg.chat.id;


        await memory.clearMemory(chatId);


        bot.sendMessage(
            chatId,
            "Short Memory cleared ✅"
        );


    });









    // MAIN CHAT


    bot.on(
    "message",
    async(msg)=>{


        if(!msg.text)
            return;


        if(msg.text.startsWith("/"))
            return;



        const chatId = msg.chat.id;

        const userText = msg.text;



        await users.registerUser(msg.from);



        await memory.saveMemory(
            chatId,
            "user",
            userText
        );



        // Auto Memory

        memoryExtractor.extractMemory(
            chatId,
            userText
        );





        const personalityData =
        personality.analyzePersonality(
            userText
        );


        const personalityPrompt =
        personality.getPersonalityPrompt(
            personalityData
        );






        users.getUser(
            chatId,
            (user)=>{


            longMemory.getLongMemory(
                chatId,
                (longData)=>{


                memory.getMemory(
                    chatId,
                    async(history)=>{



                    let longContext =
                    "No saved memory.";



                    longData.forEach(item=>{

                        longContext +=
`${item.key}: ${item.value}\n`;

                    });





                    const messages=[

                    {
                        role:"system",

                        content:
`
You are NoorSepiens AI.

Reply in Bangla.

${personalityPrompt}


User Memory:

${longContext}


Use memory naturally.
Be helpful and friendly.
`
                    },


                    ...history.map(h=>({

                        role:h.role,

                        content:h.message

                    }))


                    ];





                    const reply =
                    await askAI(messages);




                    await memory.saveMemory(
                        chatId,
                        "assistant",
                        reply
                    );



                    bot.sendMessage(
                        chatId,
                        reply
                    );



                    }


                );


                }


            );


            }


        );



    });



}



startBot();