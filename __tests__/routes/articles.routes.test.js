const express = require("express");
const request = require("supertest");
const articlesRouter = require("../../src/routes/articles.routes.js");
const articlesController = require("../../src/controllers/articles.controllers.js");

jest.mock("../../src/controllers/articles.controllers.js", () => ({
  getAllArticles: jest.fn(),
  getArticleById: jest.fn(),
  getCommentsByArticle: jest.fn(),
  postCommentByArticle: jest.fn(),
  patchVoteByArticle: jest.fn(),
}));

describe("Articles router test", () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/articles", articlesRouter);

    jest.clearAllMocks();
  });

  describe("GET /api/articles", () => {
    it("should invoke getAllArticles", async () => {
      articlesController.getAllArticles.mockImplementation((req, res) => {
        res.status(200).send({ articles: [] });
      });

      const response = await request(app).get("/api/articles");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("articles");
      expect(articlesController.getAllArticles).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/articles/:article_id", () => {
    it("should invoke getArticleById", async () => {
      articlesController.getArticleById.mockImplementation((req, res) => {
        res.status(200).send({ article: { article_id: 1 } });
      });

      const response = await request(app).get("/api/articles/1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("article");
      expect(articlesController.getArticleById).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    it("should invoke getCommentsByArticle", async () => {
      articlesController.getCommentsByArticle.mockImplementation((req, res) => {
        res.status(200).send({ comments: [] });
      });

      const response = await request(app).get("/api/articles/1/comments");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("comments");
      expect(articlesController.getCommentsByArticle).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    it("should invoke postCommentByArticle", async () => {
      articlesController.postCommentByArticle.mockImplementation((req, res) => {
        res.status(201).send({ comment: { comment_id: 19 } });
      });

      const response = await request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Great read" });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("comment");
      expect(articlesController.postCommentByArticle).toHaveBeenCalledTimes(1);
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    it("should invoke patchVoteByArticle", async () => {
      articlesController.patchVoteByArticle.mockImplementation((req, res) => {
        res.status(200).send({ article: { article_id: 1, votes: 101 } });
      });

      const response = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("article");
      expect(articlesController.patchVoteByArticle).toHaveBeenCalledTimes(1);
    });
  });
});
