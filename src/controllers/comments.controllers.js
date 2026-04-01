const {
  deleteCommentByIdService,
  patchVoteByCommentService,
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

async function patchVoteByCommentController(req, res, next) {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const updatedComment = await patchVoteByCommentService(
      comment_id,
      inc_votes,
    );
    res.status(HTTP_STATUS.OK).send({ comment: updatedComment });
  } catch (err) {
    next(err);
  }
}

module.exports = { deleteCommentByIdController, patchVoteByCommentController };
