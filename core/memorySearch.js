const longMemory = require("./longmemory");



function search(userId, query, callback){


    longMemory.get(userId,(data)=>{


        if(!data || data.length === 0){

            callback([]);

            return;

        }



        const words = query
        .toLowerCase()
        .split(" ");



        const result = data.filter(item=>{


            const memoryText = item.memory
            .toLowerCase();



            return words.some(word=>{

                return memoryText.includes(word);

            });


        });



        callback(

            result.slice(0,10)

        );


    });


}



module.exports = {

    search

};
