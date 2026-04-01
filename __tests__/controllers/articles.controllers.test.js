const {
  getAllArticles,
  getArticleById,
  getCommentsByArticle,
  postCommentByArticle,
  patchVoteByArticle,
} = require("../../src/controllers/articles.controllers.js");
const { HTTP_STATUS } = require("../../src/constants/index.js");
const {
  fetchArticlesService,
  fetchArticleByIdService,
  fetchCommentsByArticleService,
  addCommentByArticleService,
  updateVoteByArticleService,
} = require("../../src/services/articles.services.js");

jest.mock("../../src/services/articles.services.js", () => ({
  fetchArticlesService: jest.fn(),
  fetchArticleByIdService: jest.fn(),
  fetchCommentsByArticleService: jest.fn(),
  addCommentByArticleService: jest.fn(),
  updateVoteByArticleService: jest.fn(),
}));

describe("articles controllers", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {}, params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllArticles", () => {
    it("should send status 200 and articles on success", async () => {
      const mockArticles = [
        {
          article_id: 1,
          title: "articleTitle",
          created_at: "10-09-2025",
        },
      ];
      fetchArticlesService.mockResolvedValue(mockArticles);

      await getAllArticles(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ articles: mockArticles });
      expect(next).not.toHaveBeenCalled();
    });

    it("should pass errors to next", async () => {
      const err = new Error("service failed");
      fetchArticlesService.mockRejectedValue(err);

      await getAllArticles(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getArticleById", () => {
    it("should send status 200 and article", async () => {
      req.params = { article_id: "1" };
      const mockArticle = { article_id: 1, title: "Living in the shadow" };
      fetchArticleByIdService.mockResolvedValue(mockArticle);

      await getArticleById(req, res, next);

      expect(fetchArticleByIdService).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ article: mockArticle });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("getCommentsByArticle", () => {
    it("should send status 200 and comments", async () => {
      req.params = { article_id: "1" };
      const mockComments = [{ comment_id: 1, body: "text" }];
      fetchCommentsByArticleService.mockResolvedValue(mockComments);

      await getCommentsByArticle(req, res, next);

      expect(fetchCommentsByArticleService).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ comments: mockComments });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("postCommentByArticle", () => {
    it("should send status 201 and created comment", async () => {
      req.params = { article_id: "1" };
      req.body = { username: "butter_bridge", body: "great read" };
      const mockComment = { comment_id: 19, body: "great read" };
      addCommentByArticleService.mockResolvedValue(mockComment);

      await postCommentByArticle(req, res, next);

      expect(addCommentByArticleService).toHaveBeenCalledWith(
        "1",
        "butter_bridge",
        "great read",
      );
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(res.send).toHaveBeenCalledWith({ comment: mockComment });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("patchVoteByArticle", () => {
    it("should send status 200 and updated article", async () => {
      req.params = { article_id: "1" };
      req.body = { inc_votes: 1 };
      const mockArticle = { article_id: 1, votes: 101 };
      updateVoteByArticleService.mockResolvedValue(mockArticle);

      await patchVoteByArticle(req, res, next);

      expect(updateVoteByArticleService).toHaveBeenCalledWith("1", 1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.send).toHaveBeenCalledWith({ article: mockArticle });
      expect(next).not.toHaveBeenCalled();
    });

    it("should pass errors to next", async () => {
      req.params = { article_id: "1" };
      req.body = { inc_votes: 1 };
      const err = new Error("patch failed");
      updateVoteByArticleService.mockRejectedValue(err);

      await patchVoteByArticle(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
