const axios = require("axios");

const webSearch = require("./webSearch");
const browserOpen = require("./browserTool");


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
"Search latest information from internet",

parameters:{

type:"object",

properties:{

query:{
type:"string"
}

},

required:["query"]

}

}

},


{
type:"function",

function:{

name:"browser_open",

description:
"Open webpage and read content",

parameters:{

type:"object",

properties:{

url:{
type:"string"
}

},

required:["url"]

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



// TOOL CALL

if(aiMessage.tool_calls){


const tool =
aiMessage.tool_calls[0];


const name =
tool.function.name;



const args =
JSON.parse(
tool.function.arguments
);





let result;



// WEB SEARCH

if(name==="web_search"){


console.log(
"Searching web:",
args.query
);


result =
await webSearch(args.query);


}





// BROWSER OPEN

if(name==="browser_open"){


console.log(
"Opening:",
args.url
);


result =
await browserOpen(args.url);


}





const secondMessages=[

...messages,

aiMessage,

{

role:"tool",

tool_call_id:tool.id,

content:
JSON.stringify(result)

}

];






const final =
await axios.post(

"https://openrouter.ai/api/v1/chat/completions",

{

model:"openai/gpt-4o-mini",

messages:[

{

role:"system",

content:
content:

`
তুমি NoorSepiens AI.

Current date: ${new Date().toISOString().split("T")[0]}

Search অথবা webpage থেকে পাওয়া তথ্য ব্যবহার করে উত্তর দাও।

Realtime তথ্যের ক্ষেত্রে কখনো অনুমান করবে না।

যদি user:
- আজকের খবর
- সর্বশেষ খবর
- latest update
- current event
- realtime information

জিজ্ঞেস করে, তাহলে অবশ্যই web search ব্যবহার করবে।

Rules:
- সর্বশেষ এবং নির্ভরযোগ্য source ব্যবহার করো।
- পুরোনো তথ্য ব্যবহার করো না, যদি না user historical information চায়।
- উত্তরের সাথে তথ্যের তারিখ উল্লেখ করো।
- প্রয়োজন হলে source link উল্লেখ করো।

বাংলায় পরিষ্কার, স্বাভাবিক এবং সংক্ষিপ্ত উত্তর দাও।
`

},

...secondMessages

]

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



return final.data
.choices[0]
.message
.content;


}




if(aiMessage.content){

return aiMessage.content;

}



return "কোনো উত্তর পাওয়া যায়নি ❌";



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
