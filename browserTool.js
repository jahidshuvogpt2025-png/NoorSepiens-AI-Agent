const readURL = require("./urlReader");


async function browserOpen(url){

    const content =
    await readURL(url);


    return {

        url:url,

        content:content

    };

}



module.exports = browserOpen;
