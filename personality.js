// NoorSepiens Personality Engine v1.1

function analyzePersonality(text){

    let personality = {

        language: "Bangla",
        style: "friendly",
        length: "medium",
        tone: "natural",
        emoji: false,
        englishMix: false
    };


    // Reply length detection

    if(text.length < 30){
        personality.length = "short";
    }

    if(text.length > 120){
        personality.length = "detailed";
    }



    // Casual style

    const casualWords = [
        "ভাই",
        "হাই",
        "হ্যালো",
        "কেমন",
        "কি করো",
        "হুম",
        "আচ্ছা",
        "ওকে",
        "ok"
    ];


    casualWords.forEach(word=>{

        if(text.includes(word)){
            personality.style = "casual";
        }

    });



    // Emoji user detection

    const emojiRegex = /[\u{1F300}-\u{1FAFF}]/u;

    if(emojiRegex.test(text)){
        personality.emoji = true;
    }



    // Bangla + English mix detection

    const englishRegex = /[a-zA-Z]/;

    if(englishRegex.test(text)){
        personality.englishMix = true;
    }



    // Question detection

    if(
        text.includes("?") ||
        text.includes("কি") ||
        text.includes("কিভাবে")
    ){
        personality.tone = "helpful";
    }



    return personality;

}



function getPersonalityPrompt(data){

return `

User Personality Profile:

Language:
${data.language}

Reply Style:
${data.style}

Answer Length:
${data.length}

Tone:
${data.tone}

Use Emoji:
${data.emoji}

English Mix:
${data.englishMix}


Always reply according to this user's natural communication style.

`;

}



module.exports = {

    analyzePersonality,
    getPersonalityPrompt

};