const db = require("./database");

function saveMemory(userId, role, message) {
    db.run(
        "INSERT INTO memory (user_id, role, message) VALUES (?, ?, ?)",
        [userId, role, message]
    );
}

function getMemory(userId, callback) {
    db.all(
        "SELECT role, message FROM memory WHERE user_id = ? ORDER BY id DESC LIMIT 20",
        [userId],
        (err, rows) => {
            if (err) {
                callback([]);
                return;
            }

            callback(rows.reverse());
        }
    );
}

function clearMemory(userId) {
    db.run(
        "DELETE FROM memory WHERE user_id = ?",
        [userId]
    );
}

module.exports = {
    saveMemory,
    getMemory,
    clearMemory
};
