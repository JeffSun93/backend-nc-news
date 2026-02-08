const db = require("../../db/connection.js");

function selectAllTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => rows);
}

module.exports = { selectAllTopics };
