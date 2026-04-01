const {
  fetchUsersService,
  fetchUserByUsername,
} = require("../../src/services/users.services.js");
const {
  selectAllUsers,
  selectUserByUsername,
} = require("../../src/models/users.models.js");
const {
  NotFoundError,
  BadRequestError,
} = require("../../src/errors/customError.js");
const { ERROR_MSG } = require("../../src/constants/index.js");

jest.mock("../../src/models/users.models.js", () => ({
  selectAllUsers: jest.fn(),
  selectUserByUsername: jest.fn(),
}));

describe("users services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchUsersService", () => {
    it("returns all users from model", async () => {
      const mockUsers = [
        { username: "butter_bridge" },
        { username: "icellusedkars" },
      ];
      selectAllUsers.mockResolvedValue(mockUsers);

      const result = await fetchUsersService();

      expect(result).toEqual(mockUsers);
      expect(selectAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchUserByUsername", () => {
    it("returns user for valid username", async () => {
      const mockUser = { username: "butter_bridge", name: "jonny" };
      selectUserByUsername.mockResolvedValue(mockUser);

      const result = await fetchUserByUsername("butter_bridge");

      expect(result).toEqual(mockUser);
      expect(selectUserByUsername).toHaveBeenCalledWith("butter_bridge");
    });

    it("throws NotFoundError when user does not exist", async () => {
      selectUserByUsername.mockResolvedValue(undefined);

      await expect(fetchUserByUsername("does_not_exist")).rejects.toThrow(
        NotFoundError,
      );
      await expect(fetchUserByUsername("does_not_exist")).rejects.toThrow(
        ERROR_MSG.USER_NOT_FOUND,
      );
    });

    it("throws BadRequestError for blank username", async () => {
      await expect(fetchUserByUsername("   ")).rejects.toThrow(BadRequestError);
      expect(selectUserByUsername).not.toHaveBeenCalled();
    });
  });
});
