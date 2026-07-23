// NoorSepiens Auto Memory Extractor v1.0


function extractMemory(text){

    let memories = [];


    // Location

    const location =
    text.match(/আমি\s+(.+)\s+থাকি/);

    if(location){

        memories.push({

            key:"location",
            value:location[1]

        });

    }



    // Learning / Interest

    const learning =
    text.match(/আমি\s+(.+)\s+শিখছি/);

    if(learning){

        memories.push({

            key:"interest",
            value:learning[1]

        });

    }



    // Favorite

    const favorite =
    text.match(/আমার প্রিয়\s+(.+)/);

    if(favorite){

        memories.push({

            key:"favorite",
            value:favorite[1]

        });

    }



    return memories;

}



module.exports = {
    extractMemory
};