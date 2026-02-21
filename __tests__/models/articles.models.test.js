const { selectAllArticles } = require("../../src/models/articles.models.js");
const db = require("../../db/connection.js");

afterAll(() => db.end());

describe("selectAllArticles Model", () => {
  it("should return an array of all articles objects", () => {
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
          comment_count: expect.any(String),
        });
      });
    });
  });

  it("should be sorted by date in descending order", () => {
    return selectAllArticles("created_at", "DESC").then((articles) => {
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });

  //how to test count?
  it("should be grouped by article_id and count the comments", () => {
    return selectAllArticles("created_at", "DESC").then((articles) => {
      console.log(articles);
    });
  });
});
