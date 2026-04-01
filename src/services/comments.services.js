const { NotFoundError, BadRequestError } = require("../errors/customError.js");
const { ERROR_MSG } = require("../constants/index.js");
const {
  deleteCommentById,
  patchVoteByComment,
} = require("../models/comments.models.js");
const { validatePositiveInteger } = require("../utils/validators.js");
const {
  handleDatabaseError,
  isDatabaseError,
} = require("../errors/dbErrorHandler.js");

async function deleteCommentByIdService(comment_id) {
  validatePositiveInteger(comment_id, "comment_id");

  try {
    const rowCount = await deleteCommentById(comment_id);
    if (rowCount === 0) {
      throw new NotFoundError(ERROR_MSG.COMMENT_NOT_FOUND);
    }
    return rowCount;
  } catch (err) {
    if (isDatabaseError(err)) {
      throw handleDatabaseError(err);
    }
    throw err;
  }
}

async function patchVoteByCommentService(comment_id, inc_votes) {
  validatePositiveInteger(comment_id, "comment_id");
  if (typeof inc_votes !== "number") {
    throw new BadRequestError("inc_votes must be a number");
  }
  try {
    const { updatedComment, rowCount } = await patchVoteByComment(
      comment_id,
      inc_votes,
    );
    if (rowCount === 0) {
      throw new NotFoundError(ERROR_MSG.COMMENT_NOT_FOUND);
    }
    return updatedComment;
  } catch (err) {
    if (isDatabaseError(err)) {
      throw handleDatabaseError(err);
    }
    throw err;
  }
}

module.exports = { deleteCommentByIdService, patchVoteByCommentService };
