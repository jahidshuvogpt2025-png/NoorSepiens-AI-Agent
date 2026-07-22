require("dotenv").config();
users.createUsersTable();

const TelegramBot = require("node-telegram-bot-api");
const users = require("./users");

const askAI = require("./ai");
const memory = require("./memory");
const longMemory = require("./longmemory");


const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    {
        polling: true
    }
);


console.log("NoorSepiens AI Started ✅");



// START COMMAND

bot.onText(/\/start/, (msg)=>{
bot.onText(/\/start/, (msg)=>{

    const chatId = msg.chat.id;

    users.registerUser(msg.from);


    bot.sendMessage(
        chatId,
`🤖 Welcome to NoorSepiens AI

আপনার User Profile তৈরি হয়েছে ✅

আমি আপনার Personal AI Assistant.

প্রশ্ন করুন, আমি উত্তর দেবো।`
    );

});

    bot.onText(/\/profile/, (msg)=>{

    const chatId = msg.chat.id;


    users.getUser(chatId,(user)=>{


        if(!user){

            bot.sendMessage(
                chatId,
                "User profile পাওয়া যায়নি ❌"
            );

            return;
        }


        bot.sendMessage(
            chatId,
`👤 User Profile

Name: ${user.first_name}

Username: @${user.username || "none"}

ID: ${user.telegram_id}

Join Date: ${user.created_at}`
        );


    });


});




// MEMORY COMMAND

bot.onText(/\/memory/, (msg)=>{

    const chatId = msg.chat.id;


    memory.getMemory(chatId,(data)=>{


        if(data.length === 0){

            bot.sendMessage(
                chatId,
                "Memory empty 🧠"
            );

            return;
        }



        let text="🧠 Your Memory:\n\n";


        data.forEach(item=>{

            text += `${item.role}: ${item.message}\n\n`;

        });



        bot.sendMessage(
            chatId,
            text
        );


    });

});





// LONG MEMORY COMMAND

bot.onText(/\/longmemory/, (msg)=>{


    const chatId = msg.chat.id;


    longMemory.getLongMemory(chatId,(data)=>{


        if(data.length === 0){

            bot.sendMessage(
                chatId,
                "Long Memory empty 🧠"
            );

            return;
        }



        let text="🧠 Long Memory:\n\n";


        data.forEach(item=>{

            text += `${item.key}: ${item.value}\n`;

        });



        bot.sendMessage(
            chatId,
            text
        );


    });


});






// CLEAR MEMORY

bot.onText(/\/clear/, (msg)=>{


    const chatId = msg.chat.id;


    memory.clearMemory(chatId);


    bot.sendMessage(
        chatId,
        "Memory cleared ✅"
    );


});






// USER MESSAGE

bot.on("message", async(msg)=>{


    if(!msg.text) return;


    if(msg.text.startsWith("/"))
        return;



    const chatId = msg.chat.id;

    const userText = msg.text;



    // Save short memory

    memory.saveMemory(
        chatId,
        "user",
        userText
    );




    // Save name to long memory

    const nameMatch = userText.match(/আমার নাম (.+)/);


    if(nameMatch){


        longMemory.saveLongMemory(
            chatId,
            "name",
            nameMatch[1]
        );


    }






    memory.getMemory(
        chatId,
        async(history)=>{


            const messages=[

                {
                    role:"system",
                    content:
                    "You are NoorSepiens AI. Reply naturally in Bangla. Be helpful."
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



        }
    );


});
