const request = require("supertest");
const app = require("../src/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Users API integration", () => {
  describe("GET /api/users", () => {
    it("returns 200 with array of users", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.users.length).toBeGreaterThan(0);
      response.body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
    });
  });

  describe("GET /api/users/:username", () => {
    it("returns 200 with one user", async () => {
      const response = await request(app).get("/api/users/butter_bridge");

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        username: "butter_bridge",
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });

    it("returns 404 when user is not found", async () => {
      const response = await request(app).get("/api/users/does_not_exist");

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("User not found");
    });

    it("returns 400 for invalid blank username", async () => {
      const response = await request(app).get("/api/users/%20");

      expect(response.status).toBe(400);
      expect(response.body.msg).toContain(
        "username must be at least 1 character(s)!",
      );
    });
  });
});
