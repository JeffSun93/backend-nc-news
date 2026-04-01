const {
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticle,
  insertCommentByArticle,
  updateVoteByArticle,
  checkTopicExist,
} = require("../../src/models/articles.models.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");
const testData = require("../../db/data/test-data/index.js");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("articles model", () => {
  it("selectAllArticles should return an array of article objects", () => {
    return selectAllArticles("created_at", "DESC").then((articles) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
      articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(Date),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
    });
  });

  it("selectAllArticles should be sorted by date in descending order", () => {
    return selectAllArticles("created_at", "DESC").then((articles) => {
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });

  it("selectAllArticles should include comment_count as number", () => {
    return selectAllArticles("created_at", "DESC").then((articles) => {
      articles.forEach((article) => {
        expect(typeof article.comment_count).toBe("number");
      });
    });
  });

  it("selectArticleById should return one article with comment_count", () => {
    return selectArticleById(1).then((article) => {
      expect(article).toMatchObject({
        article_id: 1,
        author: expect.any(String),
        title: expect.any(String),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(Date),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
  });

  it("selectCommentsByArticle should return comments for article sorted by date desc", () => {
    return selectCommentsByArticle(1).then((comments) => {
      expect(comments.length).toBeGreaterThan(0);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(Date),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
        });
      });
      expect(comments).toBeSortedBy("created_at", { descending: true });
    });
  });

  it("insertCommentByArticle should insert and return new comment", () => {
    return insertCommentByArticle(1, "butter_bridge", "new comment").then(
      (comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          author: "butter_bridge",
          body: "new comment",
          article_id: 1,
          votes: 0,
          created_at: expect.any(Date),
        });
      },
    );
  });

  it("updateVoteByArticle should update votes and return rowCount", () => {
    return updateVoteByArticle(1, 2).then(({ article, rowCount }) => {
      expect(rowCount).toBe(1);
      expect(article).toMatchObject({
        article_id: 1,
        votes: 102,
      });
    });
  });

  it("checkTopicExist should return true for existing topic and false for missing topic", async () => {
    const exists = await checkTopicExist("mitch");
    const missing = await checkTopicExist("not_a_topic");

    expect(exists).toBe(true);
    expect(missing).toBe(false);
  });
});
