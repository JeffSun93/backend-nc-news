const request = require("supertest");
const app = require("../src/app.js");
const topicsRouter = require("../src/routes/topics.routes.js");
const articlesRouter = require("../src/routes/articles.routes.js");
const usersRouter = require("../src/routes/users.routes.js");

jest.mock("../src/routes/topics.routes.js", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/success", (req, res) => {
    res.status(200).send({ msg: "success!" });
  });
  return router;
});
jest.mock("../src/routes/articles.routes.js", () => {
  const express = require("express");
  const router = express.Router();
  router.get("/success", (req, res) => {
    res.status(200).send({ msg: "success!" });
  });
  return router;
});
jest.mock("../src/routes/users.routes.js", () => {
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

  describe("GET /api/articles/success", () => {
    it("should return status 200", async () => {
      const response = await request(app).get("/api/articles/success");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/users/success", () => {
    it("should return status 200", async () => {
      const response = await request(app).get("/api/users/success");
      expect(response.status).toBe(200);
      //console.log(response.body);
    });
  });

  describe("GET /api/invalid-route", () => {
    it("should return status 400", async () => {
      const response = await request(app).get("/api/invalid-route");
      expect(response.status).toBe(404);
    });
  });

  describe("Handle NotFoundError", () => {});

  describe("Handle internal error", () => {});
});
