const express = require("express");
const request = require("supertest");
const commentsRouter = require("../../src/routes/comments.routes.js");
const commentsController = require("../../src/controllers/comments.controllers.js");

jest.mock("../../src/controllers/comments.controllers.js", () => ({
  deleteCommentByIdController: jest.fn(),
  patchVoteByCommentController: jest.fn(),
}));

describe("comments router", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/comments", commentsRouter);
    jest.clearAllMocks();
  });

  it("DELETE /api/comments/:comment_id invokes deleteCommentByIdController", async () => {
    commentsController.deleteCommentByIdController.mockImplementation((req, res) => {
      res.sendStatus(204);
    });

    const response = await request(app).delete("/api/comments/1");

    expect(response.status).toBe(204);
    expect(commentsController.deleteCommentByIdController).toHaveBeenCalledTimes(1);
  });

  it("PATCH /api/comments/:comment_id invokes patchVoteByCommentController", async () => {
    commentsController.patchVoteByCommentController.mockImplementation((req, res) => {
      res.status(200).send({ comment: { comment_id: 1, votes: 20 } });
    });

    const response = await request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("comment");
    expect(commentsController.patchVoteByCommentController).toHaveBeenCalledTimes(1);
  });
});
