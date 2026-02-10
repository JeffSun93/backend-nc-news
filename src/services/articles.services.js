const { NotFoundError, BadRequestError } = require("../errors/customError.js");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
  updateVoteByArticle,
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

function fetchCommentsByArticleService(article_id) {
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

function addCommentByArticleService(article_id, username, body) {
  return insertCommentByArticle(article_id, username, body).catch((err) => {
    if (err.code === "23503") {
      if (err.detail.includes("article_id")) {
        throw new NotFoundError("Article Not Found!");
      }
      if (err.detail.includes("author")) {
        throw new NotFoundError("Author Not Found!");
      }
    }
    throw err;
  });
}

function updateVoteByArticleService(article_id, inc_votes) {
  if (inc_votes === undefined) {
    return new Promise((resolve, reject) => {
      reject(new BadRequestError("Inc_votes Required!"));
    });
  }
  if (typeof inc_votes !== "number") {
    return new Promise((resolve, reject) => {
      reject(new BadRequestError("Inc_votes Not Valid!"));
    });
  }

  return updateVoteByArticle(article_id, inc_votes).then(
    ({ article, rowCount }) => {
      if (rowCount === 0) {
        throw new NotFoundError("Article Not Found!");
      }

      return article;
    },
  );
}

module.exports = {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticleService,
  addCommentByArticleService,
  updateVoteByArticleService,
};
