const db = require("../../db/connection.js");

function selectAllArticles() {
  return db
    .query(
      `SELECT articles.author,
       articles.title,
       articles.article_id, 
       articles.topic, 
       articles.created_at, 
       articles.votes, 
       articles.article_img_url, 
       COUNT(comments.comment_id) AS comment_count 
    FROM articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`,
    )
    .then(({ rows }) => rows);
}

function selectArticleById(article_id) {
  return db
    .query(
      `SELECT author,
       title,
       article_id,
       body, 
       topic, 
       created_at, 
       votes, 
       article_img_url
       FROM articles
       WHERE article_id = $1; 
    `,
      [article_id],
    )
    .then(({ rows }) => rows[0]);
}

function selectCommentsByArticle(article_id) {
  return db
    .query(
      `SELECT comment_id,
    votes,
    created_at,
    author,
    body,
    article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
      [article_id],
    )
    .then(({ rows }) => rows);
}

function insertCommentByArticle(article_id, username, body) {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2 , $3) RETURNING *;`,
      [username, body, article_id],
    )
    .then(({ rows }) => rows[0]);
}

module.exports = {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
};
