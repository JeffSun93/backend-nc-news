const request = require("supertest");
const app = require("../src/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Articles API integration", () => {
  describe("GET /api/articles", () => {
    it("returns 200 with an array of articles", async () => {
      const response = await request(app).get("/api/articles");

      expect(response.status).toBe(200);
      expect(response.body.articles).toBeInstanceOf(Array);
      expect(response.body.articles.length).toBeGreaterThan(0);
      response.body.articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
      });
    });

    it("returns 400 for invalid sort_by", async () => {
      const response = await request(app).get(
        "/api/articles?sort_by=not_a_column",
      );

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain("sort_by must be one of");
    });

    it("returns 404 for non-existent topic", async () => {
      const response = await request(app).get("/api/articles?topic=nope");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Topic not found");
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("returns 200 with a single article", async () => {
      const response = await request(app).get("/api/articles/1");

      expect(response.status).toBe(200);
      expect(response.body.article).toMatchObject({
        article_id: 1,
        author: expect.any(String),
        title: expect.any(String),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });

    it("returns 400 for invalid article_id", async () => {
      const response = await request(app).get("/api/articles/abc");

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("article_id must be a positive integer!");
    });

    it("returns 404 for missing article", async () => {
      const response = await request(app).get("/api/articles/99999");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Article not found");
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    it("returns 200 and comments for an article", async () => {
      const response = await request(app).get("/api/articles/1/comments");

      expect(response.status).toBe(200);
      expect(response.body.comments).toBeInstanceOf(Array);
      response.body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
        });
      });
    });

    it("returns 200 with empty array when article has no comments", async () => {
      const response = await request(app).get("/api/articles/2/comments");

      expect(response.status).toBe(200);
      expect(response.body.comments).toEqual([]);
    });

    it("returns 404 when article does not exist", async () => {
      const response = await request(app).get("/api/articles/99999/comments");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Article not found");
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    it("returns 201 with inserted comment", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Great read" });

      expect(response.status).toBe(201);
      expect(response.body.comment).toMatchObject({
        comment_id: expect.any(Number),
        article_id: 1,
        author: "butter_bridge",
        body: "Great read",
        votes: expect.any(Number),
        created_at: expect.any(String),
      });
    });

    it("returns 404 when username does not exist", async () => {
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "does_not_exist", body: "Great read" });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("User not found");
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    it("returns 200 with updated article votes", async () => {
      const response = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 5 });

      expect(response.status).toBe(200);
      expect(response.body.article).toMatchObject({
        article_id: 1,
        votes: 105,
      });
    });

    it("returns 400 when inc_votes is missing", async () => {
      const response = await request(app).patch("/api/articles/1").send({});

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("inc_votes is required");
    });

    it("returns 404 when article does not exist", async () => {
      const response = await request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 1 });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Article not found");
    });
  });
});
