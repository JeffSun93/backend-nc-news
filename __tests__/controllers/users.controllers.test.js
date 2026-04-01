const {
  getAllUsers,
  getUserByUsername,
} = require("../../src/controllers/users.controllers.js");
const {
  fetchUsersService,
  fetchUserByUsername,
} = require("../../src/services/users.services.js");
const { HTTP_STATUS } = require("../../src/constants/index.js");

jest.mock("../../src/services/users.services.js", () => ({
  fetchUsersService: jest.fn(),
  fetchUserByUsername: jest.fn(),
}));

describe("users controllers", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("sends 200 and users on success", async () => {
      const mockUsers = [{ username: "butter_bridge" }];
      fetchUsersService.mockResolvedValue(mockUsers);

      await getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ users: mockUsers });
      expect(next).not.toHaveBeenCalled();
    });

    it("passes error to next", async () => {
      const err = new Error("service failed");
      fetchUsersService.mockRejectedValue(err);

      await getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getUserByUsername", () => {
    it("sends 200 and user on success", async () => {
      req.params = { username: "butter_bridge" };
      const mockUser = { username: "butter_bridge", name: "jonny" };
      fetchUserByUsername.mockResolvedValue(mockUser);

      await getUserByUsername(req, res, next);

      expect(fetchUserByUsername).toHaveBeenCalledWith("butter_bridge");
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ user: mockUser });
      expect(next).not.toHaveBeenCalled();
    });

    it("passes error to next", async () => {
      req.params = { username: "missing" };
      const err = new Error("not found");
      fetchUserByUsername.mockRejectedValue(err);

      await getUserByUsername(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
