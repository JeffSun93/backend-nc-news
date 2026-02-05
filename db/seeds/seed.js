const db = require("../connection");
const format = require("../utils/formatData");
const reform = require("../utils/reformData");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`
    DROP TABLE IF EXISTS topics CASCADE;
  `);
  await db.query(`
    CREATE TABLE topics(
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL,
      img_url VARCHAR(1000)
    );
  `);
  await db.query(`
    DROP TABLE IF EXISTS users CASCADE;
  `);
  await db.query(`
    CREATE TABLE users(
      username VARCHAR PRIMARY KEY,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000)
    );
  `);
  await db.query(`
    DROP TABLE IF EXISTS articles CASCADE;
  `);
  await db.query(`
    CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);
  await db.query(`
    DROP TABLE IF EXISTS comments;
  `);
  await db.query(`
    CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const topicValues = format(topicData, ["slug", "description", "img_url"]);
  await db.query(`
    INSERT INTO topics (slug, description, img_url)
    VALUES ${topicValues};
  `);
  const userValues = format(userData, ["username", "name", "avatar_url"]);
  await db.query(`
    INSERT INTO users (username, name, avatar_url)
    VALUES ${userValues};
  `);
  const articleValues = format(articleData, [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ]);
  const result = await db.query(`
    INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
    VALUES ${articleValues}
    RETURNING article_id, title;
  `);

  const reformedCommentData = reform(
    commentData,
    result.rows,
    "article_title",
    "title",
    "article_id",
  );

  const commentValues = format(reformedCommentData, [
    "article_id",
    "body",
    "votes",
    "author",
    "created_at",
  ]);
  await db.query(`
    INSERT INTO comments (article_id, body, votes, author, created_at)
    VALUES ${commentValues};
  `);
};
module.exports = seed;
