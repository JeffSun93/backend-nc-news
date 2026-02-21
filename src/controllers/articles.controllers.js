const {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticleService,
  addCommentByArticleService,
  updateVoteByArticleService,
} = require("../services/articles.services.js");

function getAllArticles(req, res, next) {
  const { sort_by = "created_at", order = "DESC" } = req.query;
  return fetchArticlesService(sort_by, order)
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
  return fetchCommentsByArticleService(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postCommentByArticle(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return addCommentByArticleService(article_id, username, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
}

function patchVoteByArticle(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return updateVoteByArticleService(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
  patchVoteByArticle,
};
