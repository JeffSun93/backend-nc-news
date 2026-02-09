const express = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
} = require("../controllers/articles.controllers.js");
const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticle);

articlesRouter.post("/:article_id/comments", postCommentByArticle);

module.exports = articlesRouter;
