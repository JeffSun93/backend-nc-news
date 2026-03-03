const {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticleService,
  addCommentByArticleService,
  updateVoteByArticleService,
} = require("../services/articles.services.js");
const { HTTP_STATUS, DEFAULTS } = require("../constants/index.js");

async function getAllArticles(req, res, next) {
  try {
    const { sort_by = DEFAULTS.sort_by, order = DEFAULTS.order, topic } = req.query;
    const articles = await fetchArticlesService(sort_by, order, topic);
    res.status(HTTP_STATUS.OK).send({ articles });
  } catch (err) {
    next(err);
  }
}

async function getArticleById(req, res, next) {
  try {
    const { article_id } = req.params;
    const article = await fetchArticleByIdService(article_id);
    res.status(HTTP_STATUS.OK).send({ article });
  } catch (err) {
    next(err);
  }
}

async function getCommentsByArticle(req, res, next) {
  try {
    const { article_id } = req.params;
    const comments = await fetchCommentsByArticleService(article_id);
    res.status(HTTP_STATUS.OK).send({ comments });
  } catch (err) {
    next(err);
  }
}

async function postCommentByArticle(req, res, next) {
  try {
    const { article_id } = req.params;
    const { username, body } = req.body;
    const comment = await addCommentByArticleService(
      article_id,
      username,
      body,
    );
    res.status(HTTP_STATUS.CREATED).send({ comment });
  } catch (err) {
    next(err);
  }
}

async function patchVoteByArticle(req, res, next) {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const article = await updateVoteByArticleService(article_id, inc_votes);
    res.status(HTTP_STATUS.OK).send({ article });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
  patchVoteByArticle,
};
