require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const users = require("./users");
const askAI = require("./ai");
const memory = require("./memory");
const longMemory = require("./longmemory");


// Create tables

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

bot.onText(/\/start/, (msg)=>{

    const chatId = msg.chat.id;

    users.registerUser(msg.from);


    bot.sendMessage(
        chatId,
`🤖 Welcome to NoorSepiens AI

আপনার Personal AI Assistant প্রস্তুত ✅

আমি আপনার কথাগুলো মনে রাখতে পারবো।`
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
👤 NoorSepiens Profile

Name: ${user.first_name}

Username: @${user.username || "none"}

Telegram ID: ${user.telegram_id}

Joined: ${user.created_at}
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


            let text="🧠 Short Memory\n\n";


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



            let text="🧠 Long Term Memory\n\n";


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







// CLEAR MEMORY

bot.onText(/\/clear/, (msg)=>{


    const chatId = msg.chat.id;


    memory.clearMemory(chatId);


    bot.sendMessage(
        chatId,
        "Short Memory cleared ✅"
    );


});









// CHAT SYSTEM

bot.on("message", async(msg)=>{


    if(!msg.text)
        return;


    if(msg.text.startsWith("/"))
        return;



    const chatId = msg.chat.id;

    const userText = msg.text;



    // Register user

    users.registerUser(msg.from);





    // Save user message

    memory.saveMemory(
        chatId,
        "user",
        userText
    );






    // Auto detect name


    const nameMatch =
    userText.match(/আমার নাম\s*(.+)/);



    if(nameMatch){


        longMemory.saveLongMemory(
            chatId,
            "name",
            nameMatch[1]
        );


    }







    // Get all context


    users.getUser(
        chatId,
        (user)=>{


        longMemory.getLongMemory(
            chatId,
            (longData)=>{


            memory.getMemory(
                chatId,
                async(history)=>{



                let profileContext="";



                if(user){

                    profileContext =
`
User Profile:

Name:
${user.first_name}

Username:
${user.username || "none"}
`;

                }






                let longContext="";



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

You are a personal AI assistant.

Reply naturally in Bangla.

Remember the user information.

${profileContext}


Long Term Memory:

${longContext}


Use memory when answering.

Be friendly and intelligent.
`

                },





                ...history.map(h=>({

                    role:h.role,
                    content:h.message

                }))



                ];






                const reply = await askAI(messages);






                // Save AI reply


                memory.saveMemory(
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
