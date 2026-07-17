const db = require("../database/database");


function saveUser(user){

    db.run(
    `
    INSERT OR IGNORE INTO users
    (
        telegram_id,
        username,
        first_name
    )

    VALUES(?,?,?)
    `,
    [
        user.id,
        user.username || "",
        user.first_name || ""
    ]
    );

}


module.exports = {
    saveUser
};
