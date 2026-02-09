const db = require("../../db/connection.js");

function deleteCommentById(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rowCount }) => rowCount);
}

module.exports = { deleteCommentById };
