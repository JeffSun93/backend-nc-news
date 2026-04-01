const express = require("express");
const {
  deleteCommentByIdController,
  patchVoteByCommentController,
} = require("../controllers/comments.controllers.js");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentByIdController);
commentsRouter.patch("/:comment_id", patchVoteByCommentController);

module.exports = commentsRouter;
