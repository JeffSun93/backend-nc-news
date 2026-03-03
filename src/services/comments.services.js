const { NotFoundError, BadRequestError } = require("../errors/customError.js");
const { deleteCommentById } = require("../models/comments.models.js");
const { validatePositiveInteger } = require("../utils/validators.js");
const { handleDatabaseError, isDatabaseError } = require("../errors/dbErrorHandler.js");

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
    // Re-throw custom errors as-is
    if (err instanceof NotFoundError) {
      throw err;
    }
    throw err;
  }
}

module.exports = { deleteCommentByIdService };
