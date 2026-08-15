const axios = require("axios");

const webSearch = require("./webSearch");


async function router(messages){

try{


const response = await axios.post(

"https://openrouter.ai/api/v1/chat/completions",

{

model:"openai/gpt-4o-mini",

messages:messages,


tools:[

{

type:"function",

function:{

name:"web_search",

description:
"Search the internet for latest information, news, realtime data.",


parameters:{

type:"object",

properties:{

query:{
type:"string",
description:"Search query"
}

},

required:["query"]

}

}

}

],


tool_choice:"auto"


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





const aiMessage =
response.data.choices[0].message;




// ================= TOOL CALL =================


if(aiMessage.tool_calls){


console.log(
"Tool requested:",
aiMessage.tool_calls
);



const tool =
aiMessage.tool_calls[0];



if(
tool.function.name === "web_search"
){



const args =
JSON.parse(
tool.function.arguments
);



console.log(
"Searching web:",
args.query
);



const searchResult =
await webSearch(args.query);



console.log(
"Search results received"
);





const secondMessages=[


...messages,


aiMessage,



{

role:"tool",

tool_call_id:
tool.id,


content:
JSON.stringify(searchResult)

}


];





console.log(
"Sending search result back to AI..."
);




const finalResponse =
await axios.post(

"https://openrouter.ai/api/v1/chat/completions",

{

model:"openai/gpt-4o-mini",


messages:secondMessages,


system:{

role:"system",

content:
`
তুমি NoorSepiens AI।

ওয়েব সার্চ থেকে পাওয়া তথ্য ব্যবহার করে
উত্তর তৈরি করবে।

ব্যবহারকারী realtime তথ্য চাইলে
search result ছাড়া উত্তর দেবে না।

বাংলায় উত্তর দাও।
তথ্য সংক্ষেপে এবং পরিষ্কারভাবে দাও।
প্রয়োজনে source উল্লেখ করো।
`

}


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




console.log(
"Final AI:",
finalResponse.data.choices[0].message
);



return finalResponse
.data
.choices[0]
.message
.content;



}


}




// Normal AI answer


if(aiMessage.content){

return aiMessage.content;

}




return "দুঃখিত, কোনো উত্তর পাওয়া যায়নি ❌";





}

catch(error){


console.log(
"AI ERROR:",
error.response?.data || error.message
);


return "AI উত্তর দিতে সমস্যা হচ্ছে ❌";


}



}



module.exports = router;
