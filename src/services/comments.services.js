const { NotFoundError, BadRequestError } = require("../errors/customError.js");
const { deleteCommentById } = require("../models/comments.models.js");

function deleteCommentByIdService(comment_id) {
  return deleteCommentById(comment_id)
    .then((rowCount) => {
      if (rowCount === 0) {
        throw new NotFoundError("Comment Not Found!");
      } else {
        return rowCount;
      }
    })
    .catch((err) => {
      if (err.code === "22P02") {
        throw new BadRequestError("Invalid Comment ID!");
      }
      throw err;
    });
}

module.exports = { deleteCommentByIdService };
