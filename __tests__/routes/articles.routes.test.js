const express = require("express");
const request = require("supertest");
const articlesRouter = require("../../src/routes/articles.routes.js");
const articlesController = require("../../src/controllers/articles.controllers.js");

jest.mock("../../src/controllers/articles.controllers.js", () => ({
  getAllArticles: jest.fn(),
  getArticleById: jest.fn(),
  getCommentsByArticle: jest.fn(),
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
});
