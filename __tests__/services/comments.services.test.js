const {
  deleteCommentByIdService,
  patchVoteByCommentService,
} = require("../../src/services/comments.services.js");
const {
  deleteCommentById,
  patchVoteByComment,
} = require("../../src/models/comments.models.js");
const {
  isDatabaseError,
  handleDatabaseError,
} = require("../../src/errors/dbErrorHandler.js");
const {
  BadRequestError,
  NotFoundError,
  CustomError,
} = require("../../src/errors/customError.js");
const { ERROR_MSG } = require("../../src/constants/index.js");

jest.mock("../../src/models/comments.models.js", () => ({
  deleteCommentById: jest.fn(),
  patchVoteByComment: jest.fn(),
}));

jest.mock("../../src/errors/dbErrorHandler.js", () => ({
  isDatabaseError: jest.fn(),
  handleDatabaseError: jest.fn(),
}));

describe("comments services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isDatabaseError.mockReturnValue(false);
  });

  describe("deleteCommentByIdService", () => {
    it("returns rowCount when delete succeeds", async () => {
      deleteCommentById.mockResolvedValue(1);

      const result = await deleteCommentByIdService(1);

      expect(result).toBe(1);
      expect(deleteCommentById).toHaveBeenCalledWith(1);
    });

    it("throws NotFoundError when no row is deleted", async () => {
      deleteCommentById.mockResolvedValue(0);

      await expect(deleteCommentByIdService(9999)).rejects.toThrow(NotFoundError);
      await expect(deleteCommentByIdService(9999)).rejects.toThrow(
        ERROR_MSG.COMMENT_NOT_FOUND,
      );
    });

    it("throws BadRequestError for invalid comment_id before model call", async () => {
      await expect(deleteCommentByIdService("abc")).rejects.toThrow(BadRequestError);
      expect(deleteCommentById).not.toHaveBeenCalled();
    });

    it("maps database errors via handleDatabaseError", async () => {
      const dbErr = { code: "23503" };
      const mapped = new CustomError("Referenced resource not found.", 404);
      deleteCommentById.mockRejectedValue(dbErr);
      isDatabaseError.mockReturnValue(true);
      handleDatabaseError.mockReturnValue(mapped);

      await expect(deleteCommentByIdService(1)).rejects.toBe(mapped);
      expect(handleDatabaseError).toHaveBeenCalledWith(dbErr);
    });
  });

  describe("patchVoteByCommentService", () => {
    it("returns updated comment when patch succeeds", async () => {
      const updatedComment = { comment_id: 1, votes: 17, body: "text" };
      patchVoteByComment.mockResolvedValue({ updatedComment, rowCount: 1 });

      const result = await patchVoteByCommentService(1, 1);

      expect(result).toEqual(updatedComment);
      expect(patchVoteByComment).toHaveBeenCalledWith(1, 1);
    });

    it("throws BadRequestError when inc_votes is not a number", async () => {
      await expect(patchVoteByCommentService(1, "2")).rejects.toThrow(BadRequestError);
      expect(patchVoteByComment).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when rowCount is zero", async () => {
      patchVoteByComment.mockResolvedValue({ updatedComment: undefined, rowCount: 0 });

      await expect(patchVoteByCommentService(12345, 1)).rejects.toThrow(NotFoundError);
      await expect(patchVoteByCommentService(12345, 1)).rejects.toThrow(
        ERROR_MSG.COMMENT_NOT_FOUND,
      );
    });

    it("maps database errors via handleDatabaseError", async () => {
      const dbErr = { code: "22P02" };
      const mapped = new CustomError("Invalid data format. Please check your input.", 400);
      patchVoteByComment.mockRejectedValue(dbErr);
      isDatabaseError.mockReturnValue(true);
      handleDatabaseError.mockReturnValue(mapped);

      await expect(patchVoteByCommentService(1, 1)).rejects.toBe(mapped);
      expect(handleDatabaseError).toHaveBeenCalledWith(dbErr);
    });
  });
});
