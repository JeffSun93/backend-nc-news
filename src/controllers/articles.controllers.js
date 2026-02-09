const {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticle,
} = require("../services/articles.services.js");

function getAllArticles(req, res, next) {
  return fetchArticlesService()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  return fetchArticleByIdService(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getCommentsByArticle(req, res, next) {
  const { article_id } = req.params;
  return fetchCommentsByArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

module.exports = { getAllArticles, getArticleById, getCommentsByArticle };
