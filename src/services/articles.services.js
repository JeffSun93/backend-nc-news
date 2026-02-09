const { NotFoundError } = require("../errors/customError.js");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
} = require("../models/articles.models.js");

function fetchArticlesService() {
  return selectAllArticles();
}

function fetchArticleByIdService(article_id) {
  return selectArticleById(article_id).then((article) => {
    if (!article) {
      throw new NotFoundError("Article Not Found!");
    } else {
      return article;
    }
  });
}

function fetchCommentsByArticle(article_id) {
  return Promise.all([
    selectCommentsByArticle(article_id),
    selectArticleById(article_id),
  ]).then(([comments, article]) => {
    if (!article) {
      throw new NotFoundError("Article Not Found!");
    } else {
      return comments;
    }
  });
}

module.exports = {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticle,
};
