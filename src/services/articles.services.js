const { NotFoundError, BadRequestError } = require("../errors/customError.js");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
  updateVoteByArticle,
  checkTopicExist,
} = require("../models/articles.models.js");
const {
  validatePositiveInteger,
  validateString,
  validateNumber,
  validateIncludes,
} = require("../utils/validators.js");
const { handleDatabaseError, isDatabaseError } = require("../errors/dbErrorHandler.js");
const { ARTICLE_SORT_COLUMNS, ARTICLE_SORT_ORDER, ERROR_MSG } = require("../constants/index.js");

async function fetchArticlesService(sort_by, order, topic) {
  validateIncludes(sort_by, ARTICLE_SORT_COLUMNS, "sort_by");
  validateIncludes(order, ARTICLE_SORT_ORDER, "order");

  if (topic) {
    const isTopicExist = await checkTopicExist(topic);
    if (!isTopicExist) {
      throw new NotFoundError(ERROR_MSG.TOPIC_NOT_FOUND);
    }
  }
  return await selectAllArticles(sort_by, order, topic);
}

async function fetchArticleByIdService(article_id) {
  validatePositiveInteger(article_id, "article_id");

  const article = await selectArticleById(article_id);
  if (!article) {
    throw new NotFoundError(ERROR_MSG.ARTICLE_NOT_FOUND);
  }
  return article;
}

async function fetchCommentsByArticleService(article_id) {
  validatePositiveInteger(article_id, "article_id");

  const [comments, article] = await Promise.all([
    selectCommentsByArticle(article_id),
    selectArticleById(article_id),
  ]);

  if (!article) {
    throw new NotFoundError(ERROR_MSG.ARTICLE_NOT_FOUND);
  }
  return comments;
}

async function addCommentByArticleService(article_id, username, body) {
  validatePositiveInteger(article_id, "article_id");
  validateString(username, "username", 1, 100);
  validateString(body, "body", 1, 5000);

  try {
    return await insertCommentByArticle(article_id, username, body);
  } catch (err) {
    if (isDatabaseError(err)) {
      // Handle specific foreign key violations
      if (err.code === "23503") {
        if (err.detail && err.detail.includes("article_id")) {
          throw new NotFoundError(ERROR_MSG.ARTICLE_NOT_FOUND);
        }
        if (err.detail && err.detail.includes("author")) {
          throw new NotFoundError(ERROR_MSG.USER_NOT_FOUND);
        }
      }
      // For other database errors, use the generic handler
      throw handleDatabaseError(err);
    }
    throw err;
  }
}

async function updateVoteByArticleService(article_id, inc_votes) {
  validatePositiveInteger(article_id, "article_id");

  if (inc_votes === undefined) {
    throw new BadRequestError(ERROR_MSG.INC_VOTES_REQUIRED);
  }

  validateNumber(inc_votes, "inc_votes");

  const { article, rowCount } = await updateVoteByArticle(
    article_id,
    inc_votes,
  );

  if (rowCount === 0) {
    throw new NotFoundError(ERROR_MSG.ARTICLE_NOT_FOUND);
  }

  return article;
}

module.exports = {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticleService,
  addCommentByArticleService,
  updateVoteByArticleService,
};
