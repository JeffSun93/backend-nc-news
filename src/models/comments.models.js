const db = require("../../db/connection.js");

function deleteCommentById(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rowCount }) => rowCount);
}

function patchVoteByComment(comment_id, inc_votes) {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id],
    )
    .then(({ rows, rowCount }) => ({ updatedComment: rows[0], rowCount }));
}

module.exports = { deleteCommentById, patchVoteByComment };
