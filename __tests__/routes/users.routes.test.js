const express = require("express");
const request = require("supertest");
const usersRouter = require("../../src/routes/users.routes.js");
const usersController = require("../../src/controllers/users.controllers.js");

jest.mock("../../src/controllers/users.controllers.js", () => ({
  getAllUsers: jest.fn(),
}));

describe("Users router test", () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/users", usersRouter);

    jest.clearAllMocks();
  });

  describe("GET /api/users", () => {
    it("should invoke getAllUsers", async () => {
      usersController.getAllUsers.mockImplementation((req, res) => {
        res.status(200).send({ users: [] });
      });

      const response = await request(app).get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("users");
      expect(usersController.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });
});
