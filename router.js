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
ত
