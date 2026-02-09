const {
  deleteCommentByIdService,
} = require("../services/comments.services.js");

function deleteCommentByIdController(req, res, next) {
  const { comment_id } = req.params;
  return deleteCommentByIdService(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

module.exports = { deleteCommentByIdController };
