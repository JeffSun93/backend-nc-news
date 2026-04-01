const { selectAllTopics } = require("../../src/models/topics.models.js");
const db = require("../../db/connection.js");
const seed = require("../../db/seeds/seed.js");
const testData = require("../../db/data/test-data/index.js");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("selectAllTopics Model", () => {
  it("should return an array of all topic objects", () => {
    return selectAllTopics().then((topics) => {
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
      topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
          img_url: expect.any(String),
        });
      });
    });
  });
});
