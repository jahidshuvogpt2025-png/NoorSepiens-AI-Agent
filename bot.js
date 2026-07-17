require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const ai = require("./core/ai");
const memory = require("./core/memory");
const context = require("./core/context");

const profile = require("./modules/profile");
const admin = require("./modules/admin");


const TOKEN = process.env.BOT_TOKEN;


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





// Name detection


if(
text.startsWith("আমার নাম")
){


const name =
text.replace(
"আমার নাম",
""
)
.trim();



profile.saveProfile(

id,

name

);



memory.add(

id,

"user",

text

);



bot.sendMessage(

id,

`ঠিক আছে ✅ আমি মনে রাখলাম। আপনার নাম ${name}`

);


return;


}







// Save User Message


memory.add(

id,

"user",

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

বাংলায় উত্তর দাও।

User Profile:

${JSON.stringify(userContext.user)}

Previous Memory:

${JSON.stringify(userContext.memory)}

সহায়ক, স্মার্ট এবং বন্ধুত্বপূর্ণ উত্তর দাও।
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
