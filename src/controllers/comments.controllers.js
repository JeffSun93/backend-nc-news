const {
  deleteCommentByIdService,
} = require("../services/comments.services.js");
const { HTTP_STATUS } = require("../constants/index.js");

async function deleteCommentByIdController(req, res, next) {
  try {
    const { comment_id } = req.params;
    await deleteCommentByIdService(comment_id);
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (err) {
    next(err);
  }
}

module.exports = { deleteCommentByIdController };
