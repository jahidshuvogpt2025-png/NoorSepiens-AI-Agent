function extract(text){

    const lower = text.toLowerCase();


    // Style / Calling preference

    if(
        (lower.includes("আমাকে") &&
        lower.includes("ডাকবে")) ||
        lower.includes("গুরু বলে ডাকবে")
    ){

        return {

            category:"style",
            memory:text,
            importance:5

        };

    }



    // Skill / Learning

    if(

        lower.includes("শিখছি") ||
        lower.includes("শিখতেছি") ||
        lower.includes("learn") ||
        lower.includes("python") ||
        lower.includes("coding") ||
        lower.includes("programming") ||
        lower.includes("ai")

    ){

        return {

            category:"skill",
            memory:text,
            importance:4

        };

    }



    // Project

    if(

        lower.includes("প্রজেক্ট") ||
        lower.includes("project") ||
        lower.includes("noorsepiens")

    ){

        return {

            category:"project",
            memory:text,
            importance:5

        };

    }



    // Preference

    if(

        lower.includes("আমি চাই") ||
        lower.includes("আমার পছন্দ") ||
        lower.includes("ভালো লাগে")

    ){

        return {

            category:"preference",
            memory:text,
            importance:4

        };

    }



    // Instruction (শেষে রাখবো)

    if(

        lower.includes("মনে রাখবে") ||
        lower.includes("ভুলবে না")

    ){

        return {

            category:"instruction",
            memory:text,
            importance:5

        };

    }



    return null;

}



module.exports = {
    extract
};
