// NoorSepiens Personality Engine v1.0


function analyzePersonality(text){


    let personality = {

        language: "Bangla",

        style: "friendly",

        length: "medium",

        tone: "natural"

    };



    // Short reply preference

    if(text.length < 30){

        personality.length = "short";

    }



    // Long explanation preference

    if(text.length > 100){

        personality.length = "detailed";

    }




    // Casual user detection

    const casualWords = [

        "ভাই",
        "হাই",
        "কেমন",
        "কি করো",
        "হুম",
        "আচ্ছা"

    ];



    casualWords.forEach(word=>{

        if(text.includes(word)){

            personality.style="casual";

        }

    });





    return personality;

}





function getPersonalityPrompt(data){


return `

User Personality:

Language:
${data.language}

Reply Style:
${data.style}

Answer Length:
${data.length}

Tone:
${data.tone}

Follow this style while replying.

`;

}




module.exports = {

    analyzePersonality,

    getPersonalityPrompt

};
