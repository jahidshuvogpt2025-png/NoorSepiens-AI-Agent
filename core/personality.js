function extract(text){

    const lower = text.toLowerCase();

    let result = null;


    // Name preference

    if(
        lower.includes("আমাকে") &&
        lower.includes("ডাকবে")
    ){

        result = {
            category:"style",
            memory:text,
            importance:5
        };

    }



    // Remember instruction

    else if(
        lower.includes("মনে রাখবে") ||
        lower.includes("ভুলবে না")
    ){

        result = {

            category:"instruction",
            memory:text,
            importance:5

        };

    }



    // Preference

    else if(
        lower.includes("আমি চাই") ||
        lower.includes("আমার পছন্দ")
    ){

        result={

            category:"preference",
            memory:text,
            importance:4

        };

    }



    return result;

}



module.exports = {
    extract
};
