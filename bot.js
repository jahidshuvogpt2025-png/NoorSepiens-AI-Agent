require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const ai = require("./core/ai");
const memory = require("./core/memory");
const longMemory = require("./core/longmemory");
const context = require("./core/context");

const profile = require("./modules/profile");
const admin = require("./modules/admin");


const TOKEN = process.env.BOT_TOKEN;

function autoLearn(userId, text){

    const lower = text.toLowerCase();


    if(
        lower.includes("শিখ") ||
        lower.includes("learn")
    ){

        longMemory.add(
            userId,
            "skill",
            text
        );

    }


    if(
        lower.includes("প্রজেক্ট") ||
        lower.includes("project")
    ){

        longMemory.add(
            userId,
            "project",
            text
        );

    }


    if(
        lower.includes("বাংলাদেশ") ||
        lower.includes("আমি থাকি") ||
        lower.includes("আমার পছন্দ")
    ){

        longMemory.add(
            userId,
            "personal",
            text
        );

    }

}

if(!TOKEN){

    console.log("BOT_TOKEN missing ❌");
    process.exit(1);

}



const bot = new TelegramBot(

    TOKEN,

    {
        polling:true
    }

);



console.log("NoorSepiens AI Started 🤖");



// Render Server

const app = express();


app.get("/",(req,res)=>{

    res.send("NoorSepiens AI Online 🤖");

});


app.listen(

process.env.PORT || 3000,

()=>{

console.log("Server Running ✅");

}

);





// START

bot.onText(
/\/start/,

(msg)=>{


const id = msg.chat.id;



bot.sendMessage(

id,

`
আসসালামু আলাইকুম 🌙

আমি NoorSepiens AI 🤖

আপনার ব্যক্তিগত AI Assistant।

কিভাবে সাহায্য করতে পারি?
`

);


}

);







// PROFILE


bot.onText(
/\/profile/,

(msg)=>{


const id = msg.chat.id;


profile.getProfile(

id,

(data)=>{


if(!data){


bot.sendMessage(

id,

"👤 Profile পাওয়া যায়নি"

);


return;

}



bot.sendMessage(

id,

`
👤 User Profile

নাম:
${data.name || "নেই"}

`

);



}

);



}

);








// MEMORY


bot.onText(
/\/memory/,

(msg)=>{


const id = msg.chat.id;


memory.get(

id,

(data)=>{


bot.sendMessage(

id,

`
🧠 Memory

${JSON.stringify(data,null,2)}
`

);


}

);


}

);



// Long Memory Command

bot.onText(/\/longmemory/, async(msg)=>{

    const chatId = msg.chat.id;


    longMemory.get(chatId, (data)=>{


        if(!data || data.length === 0){

            bot.sendMessage(
                chatId,
                "🧠 Long Memory খালি আছে।"
            );

            return;
        }


        let text = "🧠 Long Memory:\n\n";


        data.forEach(item=>{

            text += `• ${item.memory}\n`;

        });


        bot.sendMessage(
            chatId,
            text
        );


    });


});

                   



// CLEAR


bot.onText(
/\/clear/,

(msg)=>{


memory.clear(

msg.chat.id

);


bot.sendMessage(

msg.chat.id,

"Memory cleared ✅"

);


}

);








// ADMIN


bot.onText(
/\/admin/,

(msg)=>{


if(!admin.isAdmin(msg.chat.id)){


bot.sendMessage(

msg.chat.id,

"❌ Access Denied"

);


return;

}



bot.sendMessage(

msg.chat.id,

`
👑 NoorSepiens Admin

/users
/status
`

);


}

);







// USERS


bot.onText(
/\/users/,

(msg)=>{


if(!admin.isAdmin(msg.chat.id))
return;



admin.getUserCount(

(total)=>{


bot.sendMessage(

msg.chat.id,

`
👥 Total Users:

${total}
`

);


}

);


}

);









// MAIN AI MESSAGE


bot.on(
"message",

async(msg)=>{


const id = msg.chat.id;

const text = msg.text;



if(!text)
return;



if(text.startsWith("/"))
return;





// Smart Name + Personal Memory


if(text.startsWith("আমার নাম")){


const name = text
.replace("আমার নাম","")
.trim()
.split("\n")[0]
.trim();



if(name){


profile.saveProfile(
id,
name
);



memory.add(
id,
"user",
`আমার নাম ${name}`
);



const extraInfo = text
.split("\n")
.slice(1)
.join("\n")
.trim();



if(extraInfo){


memory.add(
id,
"user",
extraInfo
);


}



bot.sendMessage(

id,

`ঠিক আছে ✅  
আমি মনে রাখলাম।

আপনার নাম: ${name}

${extraInfo ? "অতিরিক্ত তথ্যও মনে রাখলাম 🧠" : ""}`

);



return;


}


}






// Save User Message


memory.add(

id,

"user",

text

);

autoLearn(
id,
text
);

    





try{



const userContext = await new Promise((resolve)=>{


context.getContext(

id,

(data)=>{

resolve(data);

}

);


});







const messages = [

{
role:"system",

content:
`
তুমি NoorSepiens AI 🤖

তুমি একজন ব্যক্তিগত AI Assistant।

সবসময় বাংলায় উত্তর দেবে।

ব্যবহারকারীর তথ্য:

Profile:
${JSON.stringify(userContext.user)}


Recent Conversation:
${JSON.stringify(userContext.memory)}


Long Term Memory:
${JSON.stringify(userContext.longMemory)}


নিয়ম:
- ব্যবহারকারীর পূর্বের তথ্য মনে রাখবে।
- প্রয়োজন হলে Long Memory ব্যবহার করবে।
- বন্ধুত্বপূর্ণ ও স্বাভাবিকভাবে উত্তর দেবে।
- ব্যবহারকারীর নাম জানা থাকলে নাম ধরে উত্তর দেবে।
`

},


...userContext.memory,


{
role:"user",
content:text
}

];





const reply = await ai(messages);





memory.add(

id,

"assistant",

reply

);





bot.sendMessage(

id,

reply

);





}

catch(error){


console.log(

"AI ERROR:",

error.message

);



bot.sendMessage(

id,

"দুঃখিত, AI সমস্যায় পড়েছে ❌"

);


}



}

);







bot.on(
"polling_error",

(error)=>{


console.log(

"Telegram Error:",

error.message

);


}

);
