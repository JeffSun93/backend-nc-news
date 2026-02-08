const express = require("express");
const request = require("supertest");
const topicsRouter = require("../../src/routes/topics.routes.js");
const topicsController = require("../../src/controllers/topics.controllers.js");

jest.mock("../../src/controllers/topics.controllers.js", () => ({
  getAllTopics: jest.fn(),
}));

describe("Topics router test", () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/topics", topicsRouter);

    jest.clearAllMocks();
  });

  describe("GET /api/topics", () => {
    it("should invoke getAllTopics", async () => {
      topicsController.getAllTopics.mockImplementation((req, res) => {
        res.status(200).send({ topics: [] });
      });

      const response = await request(app).get("/api/topics");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("topics");
      expect(topicsController.getAllTopics).toHaveBeenCalledTimes(1);
    });
  });
});
