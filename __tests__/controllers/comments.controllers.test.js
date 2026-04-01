const {
  deleteCommentByIdController,
  patchVoteByCommentController,
} = require("../../src/controllers/comments.controllers.js");
const {
  deleteCommentByIdService,
  patchVoteByCommentService,
} = require("../../src/services/comments.services.js");
const { HTTP_STATUS } = require("../../src/constants/index.js");

jest.mock("../../src/services/comments.services.js", () => ({
  deleteCommentByIdService: jest.fn(),
  patchVoteByCommentService: jest.fn(),
}));

describe("comments controllers", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { params: { comment_id: "1" }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("deleteCommentByIdController", () => {
    it("sends 204 on success", async () => {
      deleteCommentByIdService.mockResolvedValue(1);

      await deleteCommentByIdController(req, res, next);

      expect(deleteCommentByIdService).toHaveBeenCalledWith("1");
      expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
      expect(next).not.toHaveBeenCalled();
    });

    it("forwards errors to next", async () => {
      const err = new Error("boom");
      deleteCommentByIdService.mockRejectedValue(err);

      await deleteCommentByIdController(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("patchVoteByCommentController", () => {
    it("sends 200 with updated comment on success", async () => {
      req.body = { inc_votes: 2 };
      const updated = { comment_id: 1, votes: 18 };
      patchVoteByCommentService.mockResolvedValue(updated);

      await patchVoteByCommentController(req, res, next);

      expect(patchVoteByCommentService).toHaveBeenCalledWith("1", 2);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ comment: updated });
      expect(next).not.toHaveBeenCalled();
    });

    it("forwards errors to next", async () => {
      req.body = { inc_votes: 1 };
      const err = new Error("bad patch");
      patchVoteByCommentService.mockRejectedValue(err);

      await patchVoteByCommentController(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
