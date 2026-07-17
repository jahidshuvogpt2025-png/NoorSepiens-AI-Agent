const db = require("../database/database");



function getContext(userId,callback){


db.get(

`
SELECT *

FROM users

WHERE user_id=?

`,

[userId],


(err,user)=>{


db.all(

`
SELECT role,content

FROM memory

WHERE user_id=?

ORDER BY id DESC

LIMIT 10

`,

[userId],


(err,memory)=>{


callback({

user:user || {},

memory:memory || []

});


});


});


}



module.exports={
getContext
};
