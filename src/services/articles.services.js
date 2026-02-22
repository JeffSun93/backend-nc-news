const { NotFoundError, BadRequestError } = require("../errors/customError.js");
const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
  updateVoteByArticle,
  checkTopicExist,
} = require("../models/articles.models.js");

async function fetchArticlesService(sort_by, order, topic) {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];

  if (topic) {
    const isTopicExist = await checkTopicExist(topic);
    if (!isTopicExist) {
      throw new NotFoundError("Topic not found!");
    }
  }
  if (!validSortBy.includes(sort_by)) {
    throw new BadRequestError("Sort_by is not valid!");
  }
  if (!validOrder.includes(order)) {
    throw new BadRequestError("Order is not valid!");
  }
  return selectAllArticles(sort_by, order, topic);
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
