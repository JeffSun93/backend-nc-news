const express = require("express");
const {
  deleteCommentByIdController,
} = require("../controllers/comments.controllers.js");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentByIdController);

module.exports = commentsRouter;
