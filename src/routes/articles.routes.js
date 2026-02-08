const express = require("express");
const { getAllArticles } = require("../controllers/articles.controllers.js");
const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);

module.exports = articlesRouter;
