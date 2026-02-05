const request = require("supertest");
const app = require("../src/app.js");
const topicsRouter = require("../src/routes/topics.routes.js");

jest.mock("../src/routes/topics.routes.js", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/success", (req, res) => {
    res.status(200).send({ msg: "success!" });
  });
  return router;
});

describe("Express app basic and error handle test", () => {
  describe("GET /api/topics/success", () => {
    it("should return status 200", async () => {
      const response = await request(app).get("/api/topics/success");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/invalid-route", () => {
    it("should return status 400", async () => {
      const response = await request(app).get("/api/invalid-route");
      expect(response.status).toBe(404);
    });
  });

  describe("Handle internal error", () => {});
});
