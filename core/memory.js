const db = require("../database/database");



function add(userId,role,content){


db.run(

`
INSERT INTO memory
(user_id,role,content)

VALUES(?,?,?)

`,

[
userId,
role,
content
]

);


}




function get(userId,callback){


db.all(

`
SELECT role,content

FROM memory

WHERE user_id=?

ORDER BY id DESC

LIMIT 30

`,

[userId],


(err,rows)=>{


if(err)
return callback([]);


callback(
rows.reverse()
);


}


);


}




function clear(userId){


db.run(

`
DELETE FROM memory

WHERE user_id=?

`,

[userId]

);


}



module.exports={

add,
get,
clear

};
