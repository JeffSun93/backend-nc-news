const request = require("supertest");
const app = require("../src/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Comments API integration", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    it("returns 204 and deletes the comment", async () => {
      const { rows: beforeRows } = await db.query(
        "SELECT * FROM comments WHERE comment_id = 1;",
      );
      expect(beforeRows).toHaveLength(1);

      const response = await request(app).delete("/api/comments/1");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const { rows: afterRows } = await db.query(
        "SELECT * FROM comments WHERE comment_id = 1;",
      );
      expect(afterRows).toHaveLength(0);
    });

    it("returns 400 for invalid comment_id", async () => {
      const response = await request(app).delete("/api/comments/abc");

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("comment_id must be a positive integer!");
    });

    it("returns 404 when comment_id does not exist", async () => {
      const response = await request(app).delete("/api/comments/99999");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Comment not found");
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    it("returns 200 and increments votes", async () => {
      const { rows } = await db.query(
        "SELECT comment_id, votes FROM comments WHERE comment_id = 1;",
      );
      const originalVotes = rows[0].votes;

      const response = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 3 });

      expect(response.status).toBe(200);
      expect(response.body.comment).toMatchObject({
        comment_id: 1,
        votes: originalVotes + 3,
      });
    });

    it("returns 400 when inc_votes is missing", async () => {
      const response = await request(app).patch("/api/comments/1").send({});

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("inc_votes must be a number");
    });

    it("returns 400 when inc_votes is not a number", async () => {
      const response = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "three" });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("inc_votes must be a number");
    });

    it("returns 400 for invalid comment_id", async () => {
      const response = await request(app)
        .patch("/api/comments/not-a-number")
        .send({ inc_votes: 1 });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("comment_id must be a positive integer!");
    });

    it("returns 404 when comment_id does not exist", async () => {
      const response = await request(app)
        .patch("/api/comments/99999")
        .send({ inc_votes: 1 });

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Comment not found");
    });
  });
});
