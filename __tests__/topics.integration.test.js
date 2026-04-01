const request = require("supertest");
const app = require("../src/app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Topics API integration", () => {
  describe("GET /api/topics", () => {
    it("returns 200 with an array of topic objects", async () => {
      const response = await request(app).get("/api/topics");

      expect(response.status).toBe(200);
      expect(response.body.topics).toBeInstanceOf(Array);
      expect(response.body.topics.length).toBeGreaterThan(0);

      response.body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
          img_url: expect.any(String),
        });
      });
    });
  });
});
