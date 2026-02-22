const db = require("../../db/connection.js");

function selectAllArticles(sort_by, order, topic) {
  const queryValues = [];
  let queryStr = `SELECT articles.author,
       articles.title,
       articles.article_id, 
       articles.topic, 
       articles.created_at, 
       articles.votes, 
       articles.article_img_url, 
       COUNT(comments.comment_id)::INT AS comment_count 
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id`;
  if (topic) {
    queryStr += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
}

function selectArticleById(article_id) {
  return db
    .query(
      `SELECT articles.author,
       articles.title,
       articles.article_id,
       articles.body, 
       articles.topic, 
       articles.created_at, 
       articles.votes, 
       articles.article_img_url,
       COUNT(comments.comment_id)::INT AS comment_count
       FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id;
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

function updateVoteByArticle(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [inc_votes, article_id],
    )
    .then(({ rows, rowCount }) => {
      return { article: rows[0], rowCount };
    });
}

function checkTopicExist(topic) {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
    .then(({ rows }) => {
      return rows.length > 0;
    });
}

module.exports = {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
  updateVoteByArticle,
  checkTopicExist,
};
