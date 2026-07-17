const axios = require("axios");



async function askAI(messages){


const response = await axios.post(

"https://openrouter.ai/api/v1/chat/completions",

{

model:"openai/gpt-4o-mini",

messages

},


{

headers:{

Authorization:
`Bearer ${process.env.OPENROUTER_KEY}`,

"Content-Type":
"application/json"

}

}


);



return response.data
.choices[0]
.message
.content;


}



module.exports=askAI;
