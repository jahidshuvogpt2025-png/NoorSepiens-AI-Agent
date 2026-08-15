const axios = require("axios");
const cheerio = require("cheerio");


async function browserOpen(url){

try{

console.log("Reading webpage:",url);


const response = await axios.get(url,{
headers:{
"User-Agent":
"Mozilla/5.0"
},

timeout:10000

});


const $ = cheerio.load(response.data);


$("script").remove();
$("style").remove();


let text =
$("body")
.text()
.replace(/\s+/g," ")
.trim();



return {

url:url,

content:text.substring(0,5000)

};


}

catch(error){

console.log(
"Browser error:",
error.message
);


return {
error:"Page read failed"
};


}


}


module.exports = browserOpen;
